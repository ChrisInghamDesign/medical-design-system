"use client"

/**
 * Icons that follow the design system's icon library (tokens.icons.library).
 *
 * Components import icons from here instead of "@hugeicons/core-free-icons":
 * scripts/design-system.ts rewrites those imports in components/ui on every build,
 * so this survives a DS Manager sync. Each icon is exported as its HugeIcons name
 * (a plain string, so server components can pass it to <HugeiconsIcon />), and
 * <HugeiconsIcon /> draws the matching icon from the active library.
 *
 * To use a new icon: add a row to ICONS with its equivalent in every library.
 */
import * as React from "react"
import {
  Add01Icon as HAdd01Icon,
  Alert02Icon as HAlert02Icon,
  ArrowDown01Icon as HArrowDown01Icon,
  ArrowDown02Icon as HArrowDown02Icon,
  ArrowDownIcon as HArrowDownIcon,
  ArrowLeft01Icon as HArrowLeft01Icon,
  ArrowLeftIcon as HArrowLeftIcon,
  ArrowRight01Icon as HArrowRight01Icon,
  ArrowRightIcon as HArrowRightIcon,
  ArrowUp01Icon as HArrowUp01Icon,
  Calendar03Icon as HCalendar03Icon,
  Cancel01Icon as HCancel01Icon,
  CheckmarkCircle02Icon as HCheckmarkCircle02Icon,
  Copy01Icon as HCopy01Icon,
  DashboardSquare01Icon as HDashboardSquare01Icon,
  Delete02Icon as HDelete02Icon,
  Download01Icon as HDownload01Icon,
  Edit02Icon as HEdit02Icon,
  File01Icon as HFile01Icon,
  FileAttachmentIcon as HFileAttachmentIcon,
  Folder01Icon as HFolder01Icon,
  Home01Icon as HHome01Icon,
  Image01Icon as HImage01Icon,
  InformationCircleIcon as HInformationCircleIcon,
  Loading03Icon as HLoading03Icon,
  Mail01Icon as HMail01Icon,
  Menu01Icon as HMenu01Icon,
  MinusSignIcon as HMinusSignIcon,
  MoreHorizontalCircle01Icon as HMoreHorizontalCircle01Icon,
  MoreHorizontalIcon as HMoreHorizontalIcon,
  MultiplicationSignCircleIcon as HMultiplicationSignCircleIcon,
  Notification03Icon as HNotification03Icon,
  Pdf01Icon as HPdf01Icon,
  Search01Icon as HSearch01Icon,
  SearchIcon as HSearchIcon,
  Settings02Icon as HSettings02Icon,
  Share08Icon as HShare08Icon,
  SidebarLeftIcon as HSidebarLeftIcon,
  Stethoscope02Icon as HStethoscope02Icon,
  TextBoldIcon as HTextBoldIcon,
  TextItalicIcon as HTextItalicIcon,
  TextUnderlineIcon as HTextUnderlineIcon,
  Tick02Icon as HTick02Icon,
  UnfoldMoreIcon as HUnfoldMoreIcon,
  UserIcon as HUserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon as HugeBase } from "@hugeicons/react"
import {
  ArrowDown as LArrowDown,
  ArrowLeft as LArrowLeft,
  ArrowRight as LArrowRight,
  Bell as LBell,
  Bold as LBold,
  Calendar as LCalendar,
  Check as LCheck,
  ChevronDown as LChevronDown,
  ChevronLeft as LChevronLeft,
  ChevronRight as LChevronRight,
  ChevronsUpDown as LChevronsUpDown,
  ChevronUp as LChevronUp,
  CircleCheck as LCircleCheck,
  CircleX as LCircleX,
  Copy as LCopy,
  Download as LDownload,
  Ellipsis as LEllipsis,
  File as LFile,
  FileText as LFileText,
  Folder as LFolder,
  House as LHouse,
  Image as LImage,
  Info as LInfo,
  Italic as LItalic,
  LayoutDashboard as LLayoutDashboard,
  LoaderCircle as LLoaderCircle,
  Mail as LMail,
  Menu as LMenu,
  Minus as LMinus,
  PanelLeft as LPanelLeft,
  Paperclip as LPaperclip,
  Pencil as LPencil,
  Plus as LPlus,
  Search as LSearch,
  Settings as LSettings,
  Share2 as LShare2,
  Stethoscope as LStethoscope,
  Trash2 as LTrash2,
  TriangleAlert as LTriangleAlert,
  Underline as LUnderline,
  User as LUser,
  X as LX,
  type LucideIcon,
} from "lucide-react"
import {
  IconAlertTriangle,
  IconArrowDown,
  IconArrowLeft,
  IconArrowNarrowDown,
  IconArrowRight,
  IconBell,
  IconBold,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircleCheck,
  IconCircleX,
  IconCopy,
  IconDots,
  IconDownload,
  IconFile,
  IconFileTypePdf,
  IconFolder,
  IconHome,
  IconInfoCircle,
  IconItalic,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconLoader2,
  IconMail,
  IconMenu2,
  IconMinus,
  IconPaperclip,
  IconPencil,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconSelector,
  IconSettings,
  IconShare,
  IconStethoscope,
  IconTrash,
  IconUnderline,
  IconUser,
  IconX,
  type Icon as TablerIcon,
} from "@tabler/icons-react"
import {
  ArrowDown as PArrowDown,
  ArrowLeft as PArrowLeft,
  ArrowRight as PArrowRight,
  Bell as PBell,
  Calendar as PCalendar,
  CaretDown as PCaretDown,
  CaretLeft as PCaretLeft,
  CaretRight as PCaretRight,
  CaretUp as PCaretUp,
  CaretUpDown as PCaretUpDown,
  Check as PCheck,
  CheckCircle as PCheckCircle,
  CircleNotch as PCircleNotch,
  Copy as PCopy,
  DotsThree as PDotsThree,
  DownloadSimple as PDownloadSimple,
  Envelope as PEnvelope,
  File as PFile,
  FilePdf as PFilePdf,
  Folder as PFolder,
  Gear as PGear,
  House as PHouse,
  Image as PImage,
  Info as PInfo,
  List as PList,
  MagnifyingGlass as PMagnifyingGlass,
  Minus as PMinus,
  Paperclip as PPaperclip,
  PencilSimple as PPencilSimple,
  Plus as PPlus,
  ShareNetwork as PShareNetwork,
  SidebarSimple as PSidebarSimple,
  SquaresFour as PSquaresFour,
  Stethoscope as PStethoscope,
  TextB as PTextB,
  TextItalic as PTextItalic,
  TextUnderline as PTextUnderline,
  Trash as PTrash,
  User as PUser,
  Warning as PWarning,
  X as PX,
  XCircle as PXCircle,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react"

import initialTokens from "@/design-system/tokens.json"

export const ICON_LIBRARIES = [
  { id: "hugeicons", name: "HugeIcons", site: "https://hugeicons.com" },
  { id: "lucide", name: "Lucide", site: "https://lucide.dev" },
  { id: "tabler", name: "Tabler", site: "https://tabler.io/icons" },
  { id: "phosphor", name: "Phosphor", site: "https://phosphoricons.com" },
] as const

export type IconLibrary = (typeof ICON_LIBRARIES)[number]["id"]

type HugeIcon = typeof HTick02Icon

interface IconSet {
  hugeicons: HugeIcon
  lucide: LucideIcon
  tabler: TablerIcon
  phosphor: PhosphorIcon
}

/** HugeIcons name → the same icon in every library */
const ICONS = {
  Alert02Icon: { hugeicons: HAlert02Icon, lucide: LTriangleAlert, tabler: IconAlertTriangle, phosphor: PWarning },
  ArrowDown01Icon: { hugeicons: HArrowDown01Icon, lucide: LChevronDown, tabler: IconChevronDown, phosphor: PCaretDown },
  ArrowDown02Icon: { hugeicons: HArrowDown02Icon, lucide: LArrowDown, tabler: IconArrowNarrowDown, phosphor: PArrowDown },
  ArrowDownIcon: { hugeicons: HArrowDownIcon, lucide: LArrowDown, tabler: IconArrowDown, phosphor: PArrowDown },
  ArrowLeft01Icon: { hugeicons: HArrowLeft01Icon, lucide: LChevronLeft, tabler: IconChevronLeft, phosphor: PCaretLeft },
  ArrowLeftIcon: { hugeicons: HArrowLeftIcon, lucide: LArrowLeft, tabler: IconArrowLeft, phosphor: PArrowLeft },
  ArrowRight01Icon: { hugeicons: HArrowRight01Icon, lucide: LChevronRight, tabler: IconChevronRight, phosphor: PCaretRight },
  ArrowRightIcon: { hugeicons: HArrowRightIcon, lucide: LArrowRight, tabler: IconArrowRight, phosphor: PArrowRight },
  ArrowUp01Icon: { hugeicons: HArrowUp01Icon, lucide: LChevronUp, tabler: IconChevronUp, phosphor: PCaretUp },
  Calendar03Icon: { hugeicons: HCalendar03Icon, lucide: LCalendar, tabler: IconCalendar, phosphor: PCalendar },
  Cancel01Icon: { hugeicons: HCancel01Icon, lucide: LX, tabler: IconX, phosphor: PX },
  CheckmarkCircle02Icon: { hugeicons: HCheckmarkCircle02Icon, lucide: LCircleCheck, tabler: IconCircleCheck, phosphor: PCheckCircle },
  Copy01Icon: { hugeicons: HCopy01Icon, lucide: LCopy, tabler: IconCopy, phosphor: PCopy },
  File01Icon: { hugeicons: HFile01Icon, lucide: LFile, tabler: IconFile, phosphor: PFile },
  InformationCircleIcon: { hugeicons: HInformationCircleIcon, lucide: LInfo, tabler: IconInfoCircle, phosphor: PInfo },
  Loading03Icon: { hugeicons: HLoading03Icon, lucide: LLoaderCircle, tabler: IconLoader2, phosphor: PCircleNotch },
  MinusSignIcon: { hugeicons: HMinusSignIcon, lucide: LMinus, tabler: IconMinus, phosphor: PMinus },
  MoreHorizontalCircle01Icon: { hugeicons: HMoreHorizontalCircle01Icon, lucide: LEllipsis, tabler: IconDots, phosphor: PDotsThree },
  MultiplicationSignCircleIcon: { hugeicons: HMultiplicationSignCircleIcon, lucide: LCircleX, tabler: IconCircleX, phosphor: PXCircle },
  SearchIcon: { hugeicons: HSearchIcon, lucide: LSearch, tabler: IconSearch, phosphor: PMagnifyingGlass },
  Settings02Icon: { hugeicons: HSettings02Icon, lucide: LSettings, tabler: IconSettings, phosphor: PGear },
  SidebarLeftIcon: { hugeicons: HSidebarLeftIcon, lucide: LPanelLeft, tabler: IconLayoutSidebar, phosphor: PSidebarSimple },
  Tick02Icon: { hugeicons: HTick02Icon, lucide: LCheck, tabler: IconCheck, phosphor: PCheck },
  UnfoldMoreIcon: { hugeicons: HUnfoldMoreIcon, lucide: LChevronsUpDown, tabler: IconSelector, phosphor: PCaretUpDown },
  Add01Icon: { hugeicons: HAdd01Icon, lucide: LPlus, tabler: IconPlus, phosphor: PPlus },
  DashboardSquare01Icon: { hugeicons: HDashboardSquare01Icon, lucide: LLayoutDashboard, tabler: IconLayoutDashboard, phosphor: PSquaresFour },
  Delete02Icon: { hugeicons: HDelete02Icon, lucide: LTrash2, tabler: IconTrash, phosphor: PTrash },
  Download01Icon: { hugeicons: HDownload01Icon, lucide: LDownload, tabler: IconDownload, phosphor: PDownloadSimple },
  Edit02Icon: { hugeicons: HEdit02Icon, lucide: LPencil, tabler: IconPencil, phosphor: PPencilSimple },
  FileAttachmentIcon: { hugeicons: HFileAttachmentIcon, lucide: LPaperclip, tabler: IconPaperclip, phosphor: PPaperclip },
  Folder01Icon: { hugeicons: HFolder01Icon, lucide: LFolder, tabler: IconFolder, phosphor: PFolder },
  Home01Icon: { hugeicons: HHome01Icon, lucide: LHouse, tabler: IconHome, phosphor: PHouse },
  Image01Icon: { hugeicons: HImage01Icon, lucide: LImage, tabler: IconPhoto, phosphor: PImage },
  Mail01Icon: { hugeicons: HMail01Icon, lucide: LMail, tabler: IconMail, phosphor: PEnvelope },
  Menu01Icon: { hugeicons: HMenu01Icon, lucide: LMenu, tabler: IconMenu2, phosphor: PList },
  MoreHorizontalIcon: { hugeicons: HMoreHorizontalIcon, lucide: LEllipsis, tabler: IconDots, phosphor: PDotsThree },
  Notification03Icon: { hugeicons: HNotification03Icon, lucide: LBell, tabler: IconBell, phosphor: PBell },
  Pdf01Icon: { hugeicons: HPdf01Icon, lucide: LFileText, tabler: IconFileTypePdf, phosphor: PFilePdf },
  Search01Icon: { hugeicons: HSearch01Icon, lucide: LSearch, tabler: IconSearch, phosphor: PMagnifyingGlass },
  Share08Icon: { hugeicons: HShare08Icon, lucide: LShare2, tabler: IconShare, phosphor: PShareNetwork },
  Stethoscope02Icon: { hugeicons: HStethoscope02Icon, lucide: LStethoscope, tabler: IconStethoscope, phosphor: PStethoscope },
  TextBoldIcon: { hugeicons: HTextBoldIcon, lucide: LBold, tabler: IconBold, phosphor: PTextB },
  TextItalicIcon: { hugeicons: HTextItalicIcon, lucide: LItalic, tabler: IconItalic, phosphor: PTextItalic },
  TextUnderlineIcon: { hugeicons: HTextUnderlineIcon, lucide: LUnderline, tabler: IconUnderline, phosphor: PTextUnderline },
  UserIcon: { hugeicons: HUserIcon, lucide: LUser, tabler: IconUser, phosphor: PUser },
} satisfies Record<string, IconSet>

export type IconName = keyof typeof ICONS
export const ICON_NAMES = Object.keys(ICONS) as IconName[]

/* Each icon as a plain string, named like the HugeIcons export it replaces */
export const Alert02Icon = "Alert02Icon"
export const ArrowDown01Icon = "ArrowDown01Icon"
export const ArrowDown02Icon = "ArrowDown02Icon"
export const ArrowDownIcon = "ArrowDownIcon"
export const ArrowLeft01Icon = "ArrowLeft01Icon"
export const ArrowLeftIcon = "ArrowLeftIcon"
export const ArrowRight01Icon = "ArrowRight01Icon"
export const ArrowRightIcon = "ArrowRightIcon"
export const ArrowUp01Icon = "ArrowUp01Icon"
export const Calendar03Icon = "Calendar03Icon"
export const Cancel01Icon = "Cancel01Icon"
export const CheckmarkCircle02Icon = "CheckmarkCircle02Icon"
export const Copy01Icon = "Copy01Icon"
export const File01Icon = "File01Icon"
export const InformationCircleIcon = "InformationCircleIcon"
export const Loading03Icon = "Loading03Icon"
export const MinusSignIcon = "MinusSignIcon"
export const MoreHorizontalCircle01Icon = "MoreHorizontalCircle01Icon"
export const MultiplicationSignCircleIcon = "MultiplicationSignCircleIcon"
export const SearchIcon = "SearchIcon"
export const Settings02Icon = "Settings02Icon"
export const SidebarLeftIcon = "SidebarLeftIcon"
export const Tick02Icon = "Tick02Icon"
export const UnfoldMoreIcon = "UnfoldMoreIcon"
export const Add01Icon = "Add01Icon"
export const DashboardSquare01Icon = "DashboardSquare01Icon"
export const Delete02Icon = "Delete02Icon"
export const Download01Icon = "Download01Icon"
export const Edit02Icon = "Edit02Icon"
export const FileAttachmentIcon = "FileAttachmentIcon"
export const Folder01Icon = "Folder01Icon"
export const Home01Icon = "Home01Icon"
export const Image01Icon = "Image01Icon"
export const Mail01Icon = "Mail01Icon"
export const Menu01Icon = "Menu01Icon"
export const MoreHorizontalIcon = "MoreHorizontalIcon"
export const Notification03Icon = "Notification03Icon"
export const Pdf01Icon = "Pdf01Icon"
export const Search01Icon = "Search01Icon"
export const Share08Icon = "Share08Icon"
export const Stethoscope02Icon = "Stethoscope02Icon"
export const TextBoldIcon = "TextBoldIcon"
export const TextItalicIcon = "TextItalicIcon"
export const TextUnderlineIcon = "TextUnderlineIcon"
export const UserIcon = "UserIcon"

/* ------------------------------------------------------------------ */
/* Active library (tokens.json at build time; the editor canvas updates it live) */
/* ------------------------------------------------------------------ */

interface IconSettings {
  library: IconLibrary
  strokeWidth: number
}

const built = (initialTokens as { icons?: Partial<IconSettings> }).icons
const initial: IconSettings = {
  library: ICON_LIBRARIES.some((l) => l.id === built?.library) ? (built!.library as IconLibrary) : "hugeicons",
  strokeWidth: built?.strokeWidth ?? 2,
}
let current = initial
const listeners = new Set<() => void>()

/** Switch the library everywhere on the page (used by the editor canvas) */
export function setIconSettings(next: Partial<IconSettings>) {
  const library = next.library && ICON_LIBRARIES.some((l) => l.id === next.library) ? next.library : current.library
  const strokeWidth = next.strokeWidth ?? current.strokeWidth
  if (library === current.library && strokeWidth === current.strokeWidth) return
  current = { library, strokeWidth }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useIconSettings(): IconSettings {
  return React.useSyncExternalStore(
    subscribe,
    () => current,
    () => initial
  )
}

/** Phosphor has weights instead of a stroke width */
function phosphorWeight(stroke: number): "thin" | "light" | "regular" | "bold" {
  if (stroke <= 1) return "thin"
  if (stroke <= 1.5) return "light"
  if (stroke <= 2.25) return "regular"
  return "bold"
}

export type HugeiconsIconProps = Omit<React.SVGProps<SVGSVGElement>, "ref" | "strokeWidth"> & {
  icon: IconName
  /** Kept for compatibility; the design system's stroke (Icons page) wins */
  strokeWidth?: number
  size?: number | string
  library?: IconLibrary
}

/** Drop-in for @hugeicons/react's HugeiconsIcon that draws the active library */
export function HugeiconsIcon({ icon, strokeWidth, size, library, ...rest }: HugeiconsIconProps) {
  const settings = useIconSettings()
  const set: IconSet | undefined = ICONS[icon]
  if (!set) return null
  const lib = library ?? settings.library
  const stroke = settings.strokeWidth
  const common = { "data-icon": icon, "data-icon-library": lib, ...rest } as Record<string, unknown>
  if (lib === "lucide") {
    const C = set.lucide
    return <C size={size} strokeWidth={stroke} {...common} />
  }
  if (lib === "tabler") {
    const C = set.tabler
    return <C size={size} stroke={stroke} {...common} />
  }
  if (lib === "phosphor") {
    const C = set.phosphor
    return <C size={size ?? 24} weight={phosphorWeight(stroke)} {...common} />
  }
  return <HugeBase icon={set.hugeicons} size={size} strokeWidth={strokeWidth ?? stroke} {...(common as object)} />
}
