import mongoose from 'mongoose';

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
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 5,
      })
      .then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export async function disconnectDb(): Promise<void> {
  const cache = getCache();
  if (cache.conn) {
    await cache.conn.disconnect();
    cache.conn = null;
    cache.promise = null;
  }
}
