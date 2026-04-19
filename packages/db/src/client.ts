import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

type GlobalWithMongoose = typeof globalThis & {
  __debybeMongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

function getCache() {
  const g = globalThis as GlobalWithMongoose;
  if (!g.__debybeMongoose) {
    g.__debybeMongoose = { conn: null, promise: null };
  }
  return g.__debybeMongoose;
}

export async function connectDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to your environment before using @debybe/db.');
  }

  const cache = getCache();

  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting.
  const state = mongoose.connection.readyState;
  if (cache.conn && state === 1) {
    return cache.conn;
  }

  // If we have an in-flight connect attempt, await and reuse it.
  if (cache.promise && state === 2) {
    cache.conn = await cache.promise;
    return cache.conn;
  }

  // Stale cache (e.g. disconnected after a previous success): force a clean reconnect.
  cache.conn = null;
  cache.promise = null;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 45000,
      })
      .then((m) => m);
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.conn = null;
    cache.promise = null;
    throw error;
  }
}

export async function disconnectDb(): Promise<void> {
  const cache = getCache();
  if (cache.conn) {
    await cache.conn.disconnect();
    cache.conn = null;
    cache.promise = null;
  }
}
