"use client"

import * as React from "react"
import Anthropic from "@anthropic-ai/sdk"

import { AGENT_MODELS, AGENT_TOOLS, agentSystemPrompt, editorContextLine, runAgentTool, type AgentContext, type AgentModel } from "@/lib/ds/agent"
import { storage } from "@/lib/ds/store"
import type { Mode } from "@/lib/ds/types"

import { ChromeButton, cx, FieldRow, Icons, SelectInput, TextInput } from "./chrome"

const KEY_STORAGE = "ds-editor:anthropic-key"
const MODEL_STORAGE = "ds-editor:agent-model"
const MAX_STEPS = 24

type Msg = Anthropic.Beta.BetaMessageParam
type Block = Anthropic.Beta.BetaContentBlock | Anthropic.Beta.BetaContentBlockParam

const SUGGESTIONS = [
  "Make the primary colour a calm teal and keep contrast passing",
  "Use rounder corners and softer shadows",
  "Pair a serif heading font with the current body font",
  "Make buttons a bit taller with semibold text",
]

function errorMessage(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return "The API key was rejected. Check it in Settings."
  if (e instanceof Anthropic.PermissionDeniedError) return "This API key can't use that model."
  if (e instanceof Anthropic.RateLimitError) return "Rate limited by the API. Wait a moment and try again."
  if (e instanceof Anthropic.APIUserAbortError) return "Stopped."
  if (e instanceof Anthropic.APIError) return `API error ${e.status ?? ""}: ${e.message}`
  return e instanceof Error ? e.message : String(e)
}

export function AgentPanel({
  context,
  view,
  viewName,
  mode,
  selection,
}: {
  context: AgentContext
  view: string
  viewName: string
  mode: Mode
  selection: { slot: string; variant?: string } | null
}) {
  const [apiKey, setApiKey] = React.useState<string | null>(null)
  const [keyInput, setKeyInput] = React.useState("")
  const [model, setModel] = React.useState<AgentModel>("claude-opus-5-5")
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Msg[]>([])
  const [summaries, setSummaries] = React.useState<Record<string, { text: string; error?: boolean }>>({})
  const [partial, setPartial] = React.useState("")
  const [input, setInput] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const k = storage.get(KEY_STORAGE)
    const m = storage.get(MODEL_STORAGE)
    /* eslint-disable react-hooks/set-state-in-effect -- read browser storage after the static page loads */
    if (k) setApiKey(k)
    if (m && AGENT_MODELS.some((x) => x.id === m)) setModel(m as AgentModel)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, partial, busy])

  const send = async (text: string) => {
    if (!apiKey || !text.trim() || busy) return
    setError(null)
    setInput("")
    const history: Msg[] = [
      ...messages,
      {
        role: "user",
        content: [
          { type: "text", text: editorContextLine(view, viewName, mode, selection) },
          { type: "text", text: text.trim() },
        ],
      },
    ]
    setMessages([...history])
    setBusy(true)
    const controller = new AbortController()
    abortRef.current = controller
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
    // Server-side fallback when a request is declined (Opus and Sonnet support it)
    const fallback = model === "claude-haiku-5-5" ? {} : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
    try {
      for (let step = 0; step < MAX_STEPS; step++) {
        const stream = client.beta.messages.stream(
          {
            model,
            max_tokens: 16000,
            system: [{ type: "text", text: agentSystemPrompt(), cache_control: { type: "ephemeral" } }],
            tools: AGENT_TOOLS,
            messages: history,
            output_config: { effort: "medium" },
            ...fallback,
          },
          { signal: controller.signal }
        )
        stream.on("text", (delta) => setPartial((p) => p + delta))
        const message = await stream.finalMessage()
        setPartial("")
        history.push({ role: "assistant", content: message.content as Anthropic.Beta.BetaContentBlockParam[] })
        setMessages([...history])

        if (message.stop_reason === "refusal") {
          setError("Claude declined this request. Try rephrasing it.")
          break
        }
        const uses = message.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use")
        // A cut-off turn may hold half-written tool input: don't run it
        if (message.stop_reason === "max_tokens") {
          if (uses.length) setError("The reply was cut off before it finished. Try a smaller request.")
          break
        }
        if (message.stop_reason !== "tool_use" || !uses.length) break

        const results: Anthropic.Beta.BetaToolResultBlockParam[] = uses.map((u) => {
          const r = runAgentTool(u.name, u.input, context)
          setSummaries((s) => ({ ...s, [u.id]: { text: r.summary, error: r.isError } }))
          return { type: "tool_result", tool_use_id: u.id, content: r.content, ...(r.isError ? { is_error: true } : {}) }
        })
        history.push({ role: "user", content: results })
        setMessages([...history])
        if (step === MAX_STEPS - 1) setError("Stopped after many steps. Ask again to continue.")
      }
      // A turn that stopped mid tool call (cut off or declined) can't be continued: drop it
      const last = history[history.length - 1]
      if (last?.role === "assistant" && Array.isArray(last.content) && last.content.some((b) => (b as Block).type === "tool_use")) {
        history.pop()
        setMessages([...history])
      }
    } catch (e) {
      setPartial("")
      setError(errorMessage(e))
      // Keep the conversation valid for the next turn: it must end with an answered
      // assistant turn. Drop an unanswered user message (and give its text back), or
      // a tool round that never got its reply. Changes already made stay (⌘Z undoes).
      const complete = (m: Msg) =>
        m.role === "assistant" && !(Array.isArray(m.content) && m.content.some((b) => (b as Block).type === "tool_use"))
      let end = history.length
      while (end > messages.length && !complete(history[end - 1])) end--
      if (end > messages.length) setMessages(history.slice(0, end))
      else {
        setMessages(messages)
        setInput(text)
      }
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  if (!apiKey || settingsOpen) {
    return (
      <div className="flex flex-col gap-4 p-4 text-[12px] text-zinc-700">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-zinc-900">Design system agent</span>
          <p>
            Ask Claude to change your design system in plain words. It edits the same tokens and component styles as the inspector, respects
            your locks, and every change can be undone with ⌘Z. Nothing is saved to GitHub until you click Save.
          </p>
        </div>
        <FieldRow
          label="Anthropic API key"
          hint={
            <>
              Stored only in this browser and sent only to api.anthropic.com. Usage is billed to your Anthropic account.{" "}
              <a href="https://platform.claude.com/settings/keys" target="_blank" rel="noopener" className="text-blue-600 underline">
                Get a key
              </a>
            </>
          }
        >
          <div className="flex gap-2">
            <TextInput
              type="password"
              autoComplete="off"
              placeholder={apiKey ? "Saved · paste a new key to replace it" : "sk-ant-…"}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
            <ChromeButton
              variant="primary"
              disabled={!keyInput.trim()}
              onClick={() => {
                storage.set(KEY_STORAGE, keyInput.trim())
                setApiKey(keyInput.trim())
                setKeyInput("")
                setSettingsOpen(false)
              }}
            >
              Save
            </ChromeButton>
          </div>
        </FieldRow>
        <FieldRow label="Model">
          <SelectInput
            value={model}
            onChange={(e) => {
              setModel(e.target.value as AgentModel)
              storage.set(MODEL_STORAGE, e.target.value)
            }}
            aria-label="Model"
          >
            {AGENT_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.note}
              </option>
            ))}
          </SelectInput>
        </FieldRow>
        {apiKey && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-[11px] text-zinc-500 underline"
              onClick={() => {
                storage.remove(KEY_STORAGE)
                setApiKey(null)
              }}
            >
              Remove saved key
            </button>
            <ChromeButton onClick={() => setSettingsOpen(false)}>Back to chat</ChromeButton>
          </div>
        )}
      </div>
    )
  }

  const modelName = AGENT_MODELS.find((m) => m.id === model)?.name ?? model

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-3 py-2 text-[11px] text-zinc-500">
        <span className="truncate">{modelName}</span>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              disabled={busy}
              className="underline disabled:opacity-50"
              onClick={() => {
                setMessages([])
                setSummaries({})
                setError(null)
              }}
            >
              New chat
            </button>
          )}
          <button type="button" className="underline" onClick={() => setSettingsOpen(true)}>
            Settings
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-3" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] text-zinc-600">
              Ask for a change and watch it happen on the canvas. It knows which page and part you&apos;re looking at.
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-[6px] border border-zinc-200 px-2.5 py-2 text-left text-[12px] text-zinc-700 hover:bg-zinc-50"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <MessageView key={i} message={m} summaries={summaries} />
        ))}
        {partial && <div className="text-[12px] whitespace-pre-wrap text-zinc-800">{partial}</div>}
        {busy && !partial && <div className="text-[11px] text-zinc-400">Working…</div>}
        {error && <p className="rounded-[6px] bg-red-50 px-2.5 py-2 text-[12px] text-red-700">{error}</p>}
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-200 p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
          placeholder={selection ? `Ask about ${selection.slot}…` : "Ask the agent to change the design system…"}
          rows={3}
          className="w-full resize-none rounded-[6px] border border-zinc-200 p-2 text-[12px] outline-none focus:border-blue-500"
          aria-label="Message the agent"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">↵ to send · ⌘Z undoes changes</span>
          {busy ? (
            <ChromeButton onClick={() => abortRef.current?.abort()}>Stop</ChromeButton>
          ) : (
            <ChromeButton variant="primary" disabled={!input.trim()} onClick={() => send(input)}>
              Send
            </ChromeButton>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageView({ message, summaries }: { message: Msg; summaries: Record<string, { text: string; error?: boolean }> }) {
  const blocks: Block[] = typeof message.content === "string" ? [{ type: "text", text: message.content }] : (message.content as Block[])
  if (message.role === "user") {
    // Tool results are shown on the tool call; the first text block is the editor context line
    const texts = blocks.filter((b): b is Anthropic.Beta.BetaTextBlockParam => b.type === "text").slice(1)
    if (!texts.length) return null
    return (
      <div className="ml-6 self-end rounded-[8px] bg-zinc-100 px-2.5 py-2 text-[12px] whitespace-pre-wrap text-zinc-900">
        {texts.map((t) => t.text).join("\n")}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1.5">
      {blocks.map((b, i) => {
        if (b.type === "text")
          return (
            <div key={i} className="text-[12px] whitespace-pre-wrap text-zinc-800">
              {(b as Anthropic.Beta.BetaTextBlock).text}
            </div>
          )
        if (b.type === "tool_use") {
          const use = b as Anthropic.Beta.BetaToolUseBlock
          const s = summaries[use.id]
          return (
            <div
              key={i}
              className={cx(
                "flex items-center gap-1.5 rounded-[6px] border px-2 py-1 text-[11px]",
                s?.error ? "border-red-200 bg-red-50 text-red-700" : "border-zinc-200 bg-zinc-50 text-zinc-600"
              )}
            >
              {s?.error ? <Icons.alert width={11} height={11} /> : <Icons.check width={11} height={11} />}
              <span className="truncate">{s?.text ?? use.name}</span>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
