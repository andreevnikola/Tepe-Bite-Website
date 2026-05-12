export type DatabaseConfigResult = {
  valid: boolean
  issues: string[]
  ssl: boolean
  poolSize: number
}

export function validateDatabaseConfig(): DatabaseConfigResult {
  const issues: string[] = []

  if (!process.env.POSTGRESQL_URL) {
    issues.push('POSTGRESQL_URL is missing')
  }

  const poolSize = parseInt(process.env.DB_POOL_SIZE ?? '5', 10)
  if (isNaN(poolSize) || poolSize < 1) {
    issues.push('DB_POOL_SIZE must be a positive integer')
  }

  const ssl = process.env.POSTGRES_SSL === 'true'

  return {
    valid: issues.length === 0,
    issues,
    ssl,
    poolSize: isNaN(poolSize) ? 5 : poolSize,
  }
}
