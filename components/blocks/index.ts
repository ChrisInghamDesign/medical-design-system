import { block as appointmentBooking } from "./appointment-booking"
import { block as appointmentsTable } from "./appointments-table"
import { block as cart } from "./cart"
import { block as chatThread } from "./chat-thread"
import { block as checkoutSummary } from "./checkout-summary"
import { block as ctaBanner } from "./cta-banner"
import { block as emptyState } from "./empty-state"
import { block as faqAccordion } from "./faq-accordion"
import { block as featureGrid } from "./feature-grid"
import { block as generatedResults } from "./generated-results"
import { block as heroCentered } from "./hero-centered"
import { block as pricingPlans } from "./pricing-plans"
import { block as productDetail } from "./product-detail"
import { block as productGrid } from "./product-grid"
import { block as promptInput } from "./prompt-input"
import { block as settingsNotifications } from "./settings-notifications"
import { block as signInCard } from "./sign-in-card"
import { block as statsRow } from "./stats-row"
import { block as usageMeter } from "./usage-meter"
import type { Block } from "./types"

export type { Block } from "./types"
export { BLOCK_CATEGORIES } from "./types"

export const BLOCKS: Block[] = [
  // Landing page
  heroCentered,
  featureGrid,
  pricingPlans,
  faqAccordion,
  ctaBanner,
  // Application
  statsRow,
  appointmentsTable,
  settingsNotifications,
  emptyState,
  signInCard,
  appointmentBooking,
  // E-commerce
  productGrid,
  productDetail,
  cart,
  checkoutSummary,
  // AI
  chatThread,
  promptInput,
  generatedResults,
  usageMeter,
]
