"use client"

import * as React from "react"
import type { DesignTokens } from "./types"

const MAX_HISTORY = 200

export function cloneTokens(t: DesignTokens): DesignTokens {
  return JSON.parse(JSON.stringify(t))
}

export function sameTokens(a: DesignTokens, b: DesignTokens) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** Read a token value by path, e.g. "colors.light.primary" */
export function getPath(t: DesignTokens, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], t)
}

export function setPath(t: DesignTokens, path: string, value: unknown): DesignTokens {
  const next = cloneTokens(t)
  const keys = path.split(".")
  let o = next as unknown as Record<string, unknown>
  for (const k of keys.slice(0, -1)) o = o[k] as Record<string, unknown>
  o[keys[keys.length - 1]] = value
  return next
}

export function isLocked(t: DesignTokens, path: string) {
  return (t.locks ?? []).includes(path)
}

interface State {
  past: DesignTokens[]
  present: DesignTokens
  future: DesignTokens[]
  /** Groups rapid edits (e.g. dragging a slider) into one undo step */
  lastKey: string | null
  lastAt: number
}

type Action =
  | { type: "set"; tokens: DesignTokens; key?: string }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "replace"; tokens: DesignTokens }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set": {
      if (sameTokens(state.present, action.tokens)) return state
      const now = Date.now()
      const merge = action.key && action.key === state.lastKey && now - state.lastAt < 800
      return {
        past: merge ? state.past : [...state.past, state.present].slice(-MAX_HISTORY),
        present: action.tokens,
        future: [],
        lastKey: action.key ?? null,
        lastAt: now,
      }
    }
    case "undo": {
      const prev = state.past[state.past.length - 1]
      if (!prev) return state
      return { past: state.past.slice(0, -1), present: prev, future: [state.present, ...state.future], lastKey: null, lastAt: 0 }
    }
    case "redo": {
      const next = state.future[0]
      if (!next) return state
      return { past: [...state.past, state.present], present: next, future: state.future.slice(1), lastKey: null, lastAt: 0 }
    }
    case "replace":
      return { past: [], present: action.tokens, future: [], lastKey: null, lastAt: 0 }
  }
}

export function useTokenHistory(initial: DesignTokens) {
  const [state, dispatch] = React.useReducer(reducer, {
    past: [],
    present: initial,
    future: [],
    lastKey: null,
    lastAt: 0,
  })

  const set = React.useCallback(
    (tokens: DesignTokens, key?: string) => dispatch({ type: "set", tokens, key }),
    []
  )
  const undo = React.useCallback(() => dispatch({ type: "undo" }), [])
  const redo = React.useCallback(() => dispatch({ type: "redo" }), [])
  const replace = React.useCallback((tokens: DesignTokens) => dispatch({ type: "replace", tokens }), [])

  return {
    tokens: state.present,
    set,
    undo,
    redo,
    replace,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  }
}

/** localStorage helpers that never throw */
export const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value)
    } catch {}
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(key)
    } catch {}
  },
}
