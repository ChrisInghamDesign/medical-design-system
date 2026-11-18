"use client"

import * as React from "react"

import type { Block } from "@/components/blocks"
import blockSources from "@/design-system/blocks-source.json"
import { CUSTOM_DIR, CUSTOM_INDEX, customRegistrySource, scaffoldCustomComponent, toComponentId } from "@/lib/ds/custom-components"
import { commitFiles, type RepoConfig } from "@/lib/ds/github"

import { ChromeButton, FieldRow, Icons, Modal, PanelSection, TextInput } from "./chrome"

const SOURCES = blockSources as Record<string, string>

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

/** Inspector for a block: what it is and its code, ready to copy */
export function BlockPanel({ block }: { block: Block }) {
  const source = SOURCES[block.id] ?? ""
  const [copied, setCopied] = React.useState(false)
  return (
    <>
      <PanelSection title={block.name}>
        <p className="text-[12px] text-zinc-600">{block.description}</p>
        <div className="flex flex-wrap gap-1.5 text-[11px] text-zinc-500">
          <span className="rounded-[4px] bg-zinc-100 px-1.5 py-0.5">{block.category}</span>
          <span className="rounded-[4px] bg-zinc-100 px-1.5 py-0.5 font-mono">components/blocks/{block.id}.tsx</span>
        </div>
        <p className="text-[11px] text-zinc-500">
          Built only from your components and theme tokens, so it follows every change you make. Use <strong>Select</strong> to click a part and
          restyle that component everywhere.
        </p>
      </PanelSection>
      <PanelSection
        title="Code"
        action={
          <button
            type="button"
            className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-900"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(source)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              } catch {}
            }}
          >
            {copied ? <Icons.check width={12} height={12} /> : <Icons.copy width={12} height={12} />} {copied ? "Copied" : "Copy"}
          </button>
        }
      >
        {source ? (
          <pre className="max-h-[60vh] overflow-auto rounded-[6px] bg-zinc-950 p-3 font-mono text-[10.5px] leading-relaxed text-zinc-100">
            {source}
          </pre>
        ) : (
          <p className="text-[12px] text-zinc-500">Source not generated yet. Run npm run ds:build.</p>
        )}
      </PanelSection>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* New custom component                                                */
/* ------------------------------------------------------------------ */

export function NewComponentDialog({
  open,
  onClose,
  repo,
  token,
  customIds,
  takenIds,
  onNeedToken,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  repo: RepoConfig
  token: string | null
  /** Custom component ids already in components/custom */
  customIds: string[]
  /** Every component id in use (library and custom) */
  takenIds: string[]
  onNeedToken: () => void
  onCreated: (url: string, id: string) => void
}) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the form each time the dialog opens
    setError(null)
  }, [open])

  const id = toComponentId(name)
  const problem = !name.trim()
    ? "Give it a name."
    : !/^[a-z]/.test(id)
      ? "Start the name with a letter."
      : takenIds.includes(id)
        ? `There's already a component called ${id}.`
        : null
  const files = id
    ? [`${CUSTOM_DIR}/${id}.tsx`, CUSTOM_INDEX]
    : []

  const create = async () => {
    if (problem || !token) return
    setBusy(true)
    setError(null)
    try {
      const desc = description.trim() || `${name.trim()} component`
      const url = await commitFiles(
        [
          { path: `${CUSTOM_DIR}/${id}.tsx`, content: scaffoldCustomComponent({ id, name: name.trim(), description: desc }) },
          { path: CUSTOM_INDEX, content: customRegistrySource([...customIds, id]) },
        ],
        `Add custom component: ${name.trim()}`,
        repo,
        token
      )
      setName("")
      setDescription("")
      onCreated(url, id)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New custom component"
      width={520}
      footer={
        <>
          <ChromeButton onClick={onClose}>Cancel</ChromeButton>
          {token ? (
            <ChromeButton variant="primary" disabled={!!problem || busy} onClick={create}>
              {busy ? "Creating…" : "Create and commit"}
            </ChromeButton>
          ) : (
            <ChromeButton variant="primary" onClick={onNeedToken}>
              <Icons.github /> Connect GitHub
            </ChromeButton>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p>
          Custom components live in <code>{CUSTOM_DIR}/</code>, next to the library&apos;s components but never replaced by the DS Manager
          sync. This commits a starter file with a demo; build it out in code, then style its parts here like any other component.
        </p>
        <FieldRow label="Name">
          <TextInput autoFocus placeholder="Patient card" value={name} onChange={(e) => setName(e.target.value)} />
        </FieldRow>
        <FieldRow label="Description">
          <TextInput placeholder="What it's for" value={description} onChange={(e) => setDescription(e.target.value)} />
        </FieldRow>
        {name.trim() && (
          <div className="flex flex-col gap-1 text-[12px] text-zinc-600">
            {problem ? (
              <span className="text-red-700">{problem}</span>
            ) : (
              <>
                <span>Files committed to {repo.branch}:</span>
                <ul className="font-mono text-[11px]">
                  {files.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <span className="text-zinc-500">It appears in the editor once the site rebuilds (about 2 minutes).</span>
              </>
            )}
          </div>
        )}
        {error && <p className="rounded-[6px] bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>}
      </div>
    </Modal>
  )
}
