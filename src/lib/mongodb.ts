import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;


async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!mongoose.connection.readyState) {
    const opts = {
      bufferCommands: false,
      // Fix TLS issues
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      connectTimeoutMS: 10000,
    };

    mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    await mongoose.connect(MONGODB_URI,{
      bufferCommands: false,
      // Fix TLS issues
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      connectTimeoutMS: 10000,
    });
  } catch (e) {
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return mongoose.connection;
}

// Connection Events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

// Handle Node.js process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default dbConnect;