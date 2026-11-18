"use client"

/**
 * Neutral UI for the editor's own panels. Deliberately uses fixed zinc colours
 * and pixel radii so the editor chrome never changes as you edit the theme.
 */
import * as React from "react"
import { cn } from "cn"

/** Class names with Tailwind conflict resolution (later classes win) */
export const cx = cn

type IconProps = React.SVGProps<SVGSVGElement>
const svg = (d: React.ReactNode) =>
  function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {d}
      </svg>
    )
  }

export const Icons = {
  undo: svg(<path d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />),
  redo: svg(<path d="m15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />),
  sun: svg(
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: svg(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />),
  desktop: svg(
    <>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  tablet: svg(
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  phone: svg(
    <>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  lock: svg(
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  unlock: svg(
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    </>
  ),
  github: svg(
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  download: svg(<path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" />),
  copy: svg(
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </>
  ),
  close: svg(<path d="M18 6 6 18M6 6l12 12" />),
  search: svg(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  grid: svg(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  palette: svg(
    <>
      <circle cx="13.5" cy="6.5" r="1" />
      <circle cx="17.5" cy="10.5" r="1" />
      <circle cx="8.5" cy="7.5" r="1" />
      <circle cx="6.5" cy="12.5" r="1" />
      <path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2a5.6 5.6 0 0 0 5.4-5.6C22 6 17.5 2 12 2Z" />
    </>
  ),
  type: svg(<path d="M4 7V4h16v3M9 20h6M12 4v16" />),
  radius: svg(<path d="M4 20V10a6 6 0 0 1 6-6h10" />),
  shadow: svg(
    <>
      <rect x="3" y="3" width="13" height="13" rx="2" />
      <path d="M20 8v11a2 2 0 0 1-2 2H7" />
    </>
  ),
  spacing: svg(<path d="M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3M3 5v14M21 5v14" />),
  component: svg(
    <path d="M12 2 9 5l3 3 3-3-3-3ZM5 9l-3 3 3 3 3-3-3-3ZM19 9l-3 3 3 3 3-3-3-3ZM12 16l-3 3 3 3 3-3-3-3Z" />
  ),
  home: svg(<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />),
  chevron: svg(<path d="m9 6 6 6-6 6" />),
  check: svg(<path d="M20 6 9 17l-5-5" />),
  alert: svg(
    <>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </>
  ),
  external: svg(<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />),
  reset: svg(<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />),
  upload: svg(<path d="M12 21V9m0 0-4 4m4-4 4 4M4 3h16" />),
}

export function ChromeButton({
  variant = "default",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost" | "danger"
  size?: "sm" | "md" | "icon"
}) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[6px] text-[13px] font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-40",
        size === "sm" && "h-7 px-2",
        size === "md" && "h-8 px-3",
        size === "icon" && "size-8",
        variant === "default" && "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50",
        variant === "primary" && "bg-zinc-900 text-white hover:bg-zinc-700",
        variant === "ghost" && "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
        variant === "danger" && "border border-red-200 bg-white text-red-600 hover:bg-red-50",
        className
      )}
      {...props}
    />
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: React.ReactNode; title?: string }[]
  className?: string
}) {
  return (
    <div className={cx("inline-flex rounded-[7px] bg-zinc-100 p-0.5", className)} role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cx(
            "inline-flex h-7 items-center justify-center gap-1.5 rounded-[5px] px-2.5 text-[12px] font-medium transition-colors",
            value === o.value ? "bg-white text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-zinc-500 hover:text-zinc-800"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function TextInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "h-8 w-full min-w-0 rounded-[6px] border border-zinc-200 bg-white px-2 text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-zinc-50 disabled:text-zinc-400",
        className
      )}
      {...props}
    />
  )
}

export function SelectInput({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        "h-8 w-full min-w-0 rounded-[6px] border border-zinc-200 bg-white px-2 text-[13px] text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-zinc-50 disabled:text-zinc-400",
        className
      )}
      {...props}
    />
  )
}

export function RangeInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="range" className={cx("h-1.5 w-full cursor-pointer accent-zinc-900", className)} {...props} />
}

export function PanelSection({
  title,
  action,
  children,
  className,
}: {
  title?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cx("flex flex-col gap-3 border-b border-zinc-200 px-4 py-4", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-2">
          {title && <h3 className="text-[12px] font-semibold text-zinc-900">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function FieldRow({ label, children, hint }: { label: React.ReactNode; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] text-zinc-600">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-zinc-500">{hint}</span>}
    </label>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 480,
}: {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  width?: number
}) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/30 p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
          <h2 className="text-[14px] font-semibold text-zinc-900">{title}</h2>
          <ChromeButton variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <Icons.close />
          </ChromeButton>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 text-[13px] text-zinc-700">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-zinc-200 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}

export function Toast({ message, tone = "default", onClose }: { message: React.ReactNode; tone?: "default" | "error"; onClose: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, tone === "error" ? 8000 : 4000)
    return () => clearTimeout(t)
  }, [onClose, tone])
  return (
    <div
      role="status"
      className={cx(
        "fixed bottom-4 left-1/2 z-50 flex max-w-lg -translate-x-1/2 items-center gap-2 rounded-[8px] px-4 py-2.5 text-[13px] shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
        tone === "error" ? "bg-red-600 text-white" : "bg-zinc-900 text-white"
      )}
    >
      {message}
    </div>
  )
}
