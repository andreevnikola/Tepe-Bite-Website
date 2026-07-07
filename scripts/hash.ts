/**
 * Print a bcrypt hash for a plaintext password.
 * Usage: npm run hash -- "<password>"
 */
import { hashPassword } from '../src/lib/auth/password'

async function main() {
  const password = process.argv[2]
  if (!password) {
    console.error('Usage: npm run hash -- "<password>"')
    process.exit(1)
  }
  const hash = await hashPassword(password)
  console.log(hash)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
