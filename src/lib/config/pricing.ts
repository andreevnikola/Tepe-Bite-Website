export const PRICING = {
  CURRENCY: 'EUR' as const,
  EUR_TO_BGN: 1.95583,
  DELIVERY: {
    /** Base locker delivery cost in EUR cents. Set to actual value (P2) before checkout goes live. */
    BASE_LOCKER_CENTS: 0,
    /** Office surcharge in EUR cents — applied regardless of free delivery threshold. */
    OFFICE_SURCHARGE_CENTS: 100,
    /** Address surcharge in EUR cents — applied regardless of free delivery threshold. */
    ADDRESS_SURCHARGE_CENTS: 230,
  },
  /** EUR cents. Orders at or above this subtotal get BASE_LOCKER_CENTS waived. */
  FREE_DELIVERY_THRESHOLD_CENTS: 3000,
} as const
