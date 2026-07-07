/**
 * Create (or reset) an admin user in MongoDB. No self-registration exists;
 * this is the only provisioning path.
 *
 * Usage: npm run admin:create -- <username> <password> [displayName]
 *
 * If the username already exists, its password/displayName are updated and the
 * account is re-activated.
 */
import mongoose from 'mongoose'
import { getMongoose } from '../src/lib/mongo'
import { Admin } from '../src/lib/mongo/models/Admin'
import { hashPassword } from '../src/lib/auth/password'

async function main() {
  const [username, password, displayName] = process.argv.slice(2)
  if (!username || !password) {
    console.error('Usage: npm run admin:create -- <username> <password> [displayName]')
    process.exit(1)
  }

  await getMongoose()

  const normalizedUsername = username.trim().toLowerCase()
  const passwordHash = await hashPassword(password)
  const existing = await Admin.findOne({ username: normalizedUsername })

  if (existing) {
    existing.passwordHash = passwordHash
    if (displayName) existing.displayName = displayName
    existing.isActive = true
    await existing.save()
    console.log(`✓ Updated admin "${normalizedUsername}" (${existing._id.toString()})`)
  } else {
    const created = await Admin.create({
      username: normalizedUsername,
      displayName: displayName || username,
      passwordHash,
      role: 'admin',
    })
    console.log(`✓ Created admin "${normalizedUsername}" (${created._id.toString()})`)
  }

  await mongoose.disconnect()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
