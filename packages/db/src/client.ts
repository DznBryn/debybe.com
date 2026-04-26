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

function getDefaultDbName() {
  return process.env.NODE_ENV === 'production' ? 'blogs' : 'blog_test';
}

function withDatabaseName(uri: string, dbName: string): string {
  const normalized = uri.trim().replace(/\/+$/, '');
  if (normalized.startsWith('mongodb://') || normalized.startsWith('mongodb+srv://')) {
    const parsed = new URL(normalized);
    const hasDbName = parsed.pathname && parsed.pathname !== '/';
    if (!hasDbName) {
      parsed.pathname = `/${dbName}`;
    }
    return parsed.toString();
  }
  return normalized;
}

export function hasMongoConfig(): boolean {
  return Boolean(process.env.MONGODB_URI || process.env.MONGODB_BASE_URI);
}

export function resolveMongoUri(): string {
  const dbName = process.env.MONGODB_DB_NAME || getDefaultDbName();
  const directUri = process.env.MONGODB_URI;
  if (directUri) {
    return withDatabaseName(directUri, dbName);
  }

  const baseUri = process.env.MONGODB_BASE_URI || 'mongodb://localhost:27017';
  return withDatabaseName(baseUri, dbName);
}

async function ensureBootstrapCollection(): Promise<void> {
  const db = mongoose.connection.db;
  if (!db) return;

  const collectionName = 'posts';
  const exists = await db.listCollections({ name: collectionName }, { nameOnly: true }).hasNext();
  if (!exists) {
    await db.createCollection(collectionName);
  }
}

export async function connectDb(): Promise<typeof mongoose> {
  if (!hasMongoConfig()) {
    throw new Error(
      'Mongo configuration is missing. Set MONGODB_URI or MONGODB_BASE_URI before using @debybe/db.',
    );
  }
  const uri = resolveMongoUri();

  const cache = getCache();

  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting.
  const state = mongoose.connection.readyState;
  if (cache.conn && state === 1) {
    return cache.conn;
  }

  // If we have an in-flight connect attempt, await and reuse it.
  if (cache.promise && state === 2) {
    cache.conn = await cache.promise;
    await ensureBootstrapCollection();
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
    await ensureBootstrapCollection();
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
