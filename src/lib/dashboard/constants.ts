/**
 * Shared dashboard enums/constants — mongoose-free so BOTH client components
 * and server code can import them without pulling the DB driver into the bundle.
 */

export const INITIATIVE_STATUSES = ['planned', 'in_progress', 'frozen', 'done'] as const
export type InitiativeStatus = (typeof INITIATIVE_STATUSES)[number]

export const INITIATIVE_STATUS_LABELS: Record<InitiativeStatus, { bg: string; en: string }> = {
  planned: { bg: 'Планирана', en: 'Planned' },
  in_progress: { bg: 'В процес', en: 'In progress' },
  frozen: { bg: 'Замразена', en: 'Frozen' },
  done: { bg: 'Завършена', en: 'Done' },
}

/** The site's three initiative pillars. */
export const INITIATIVE_CATEGORIES = ['preserve', 'improve', 'youth'] as const
export type InitiativeCategory = (typeof INITIATIVE_CATEGORIES)[number]

export const INITIATIVE_CATEGORY_LABELS: Record<InitiativeCategory, { bg: string; en: string }> = {
  preserve: { bg: 'Опазване', en: 'Preserve' },
  improve: { bg: 'Облагородяване', en: 'Improve' },
  youth: { bg: 'Младежко действие', en: 'Youth action' },
}

export const PARTNERSHIP_TYPES = ['sponsor', 'technical', 'executional', 'institutional'] as const
export type PartnershipType = (typeof PARTNERSHIP_TYPES)[number]

export const PARTNERSHIP_TYPE_LABELS: Record<PartnershipType, { bg: string; en: string }> = {
  sponsor: { bg: 'Спонсор', en: 'Sponsor' },
  technical: { bg: 'Технически партньор', en: 'Technical partner' },
  executional: { bg: 'Изпълнителски партньор', en: 'Executional partner' },
  institutional: { bg: 'Институционален партньор', en: 'Institutional partner' },
}

/** Where an inflow of money comes from. */
export const INFLOW_SOURCES = ['impact_fund', 'partner', 'external_other'] as const
export type InflowSource = (typeof INFLOW_SOURCES)[number]

export const INFLOW_SOURCE_LABELS: Record<InflowSource, { bg: string; en: string }> = {
  impact_fund: { bg: 'Фонд ТЕПЕ bite Impact', en: 'ТЕПЕ bite Impact fund' },
  partner: { bg: 'Партньор', en: 'Partner' },
  external_other: { bg: 'Външен източник', en: 'External source' },
}

export const PARTNER_LINK_TYPES = ['website', 'instagram', 'facebook', 'tiktok'] as const
export type PartnerLinkType = (typeof PARTNER_LINK_TYPES)[number]

export const ADMIN_ROLES = ['super_admin', 'admin', 'operator'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

export const SESSION_COOKIE_NAME = 'tepe_admin_session'
