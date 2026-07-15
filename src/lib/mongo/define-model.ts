import mongoose, { type Model, type Schema } from 'mongoose'

/**
 * Register (or return) a Mongoose model, HMR-safe.
 *
 * In dev, Next.js hot-reloads module code but Mongoose caches compiled models
 * on `mongoose.models`. The usual `mongoose.models.X || mongoose.model(...)`
 * pattern then keeps a STALE schema after you edit a model file — new fields get
 * silently dropped on write until you restart. Here we drop the cached model in
 * dev so the fresh schema takes effect; in production we keep the cache.
 */
export function defineModel<T>(name: string, schema: Schema): Model<T> {
  if (process.env.NODE_ENV !== 'production' && mongoose.models[name]) {
    mongoose.deleteModel(name)
  }
  return (mongoose.models[name] ?? mongoose.model(name, schema)) as Model<T>
}
