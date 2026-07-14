/**
 * Public /initiatives page configuration.
 *
 * The main /initiatives page spotlights ONE initiative as its "type-proof" card
 * (§2) and deep-dive (§3). We pin it by its immutable Mongo `_id` rather than by
 * slug or the `isFeatured` flag so the page keeps pointing at the intended
 * initiative even if it is renamed, re-slugged, or the feature flag moves.
 *
 * Product decision: RE-CONNECT Бунарджика is the pilot we lead with. If this
 * initiative is ever removed, `getPublicInitiativeById` returns null and the
 * page degrades gracefully (the §2 card is simply omitted).
 */
export const RECONNECT_INITIATIVE_ID = '6a4aaf02262cc627c6e8faec'
