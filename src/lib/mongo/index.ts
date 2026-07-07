/**
 * Cached Mongoose connection for the initiatives admin dashboard.
 *
 * This is a SEPARATE datastore from the Postgres/TypeORM order+inventory system
 * (see src/lib/db/index.ts). Only dashboard entities (admins, partners,
 * initiatives, audit logs) live here.
 *
 * The connection promise is cached on globalThis so Next.js dev HMR and
 * serverless invocations reuse a single pool instead of reconnecting.
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// App runtime loads env automatically; this makes the standalone CLI scripts
// (npm run hash / admin:create) and ts-node see the same values.
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const globalForMongo = globalThis as unknown as {
  _mongoosePromise?: Promise<typeof mongoose> | undefined
}

export async function getMongoose(): Promise<typeof mongoose> {
  if (globalForMongo._mongoosePromise) {
    return globalForMongo._mongoosePromise
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }

  const promise = mongoose
    .connect(uri, {
      bufferCommands: false,
      // Fail fast instead of hanging if the cluster is unreachable.
      serverSelectionTimeoutMS: 10_000,
    })
    .catch((err) => {
      // Don't cache a rejected connection — allow the next call to retry.
      globalForMongo._mongoosePromise = undefined
      throw err
    })

  globalForMongo._mongoosePromise = promise
  return promise
}
