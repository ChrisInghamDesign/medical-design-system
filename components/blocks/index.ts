import { block as appointmentBooking } from "./appointment-booking"
import { block as appointmentsTable } from "./appointments-table"
import { block as ctaBanner } from "./cta-banner"
import { block as emptyState } from "./empty-state"
import { block as faqAccordion } from "./faq-accordion"
import { block as featureGrid } from "./feature-grid"
import { block as heroCentered } from "./hero-centered"
import { block as pricingPlans } from "./pricing-plans"
import { block as settingsNotifications } from "./settings-notifications"
import { block as signInCard } from "./sign-in-card"
import { block as statsRow } from "./stats-row"
import type { Block } from "./types"

export type { Block } from "./types"
export { BLOCK_CATEGORIES } from "./types"

export const BLOCKS: Block[] = [
  // Marketing
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
  // Forms
  signInCard,
  appointmentBooking,
]
