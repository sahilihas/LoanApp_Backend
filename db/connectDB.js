import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connect to MongoDB WITHOUT deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('=================================');
    console.log('✅ MongoDB Connected Successfully');
    console.log('=================================');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    console.log(`⚡ State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log('=================================\n');
    
  } catch (error) {
    console.error('=================================');
    console.error('❌ MongoDB Connection Error');
    console.error('=================================');
    console.error(`Error: ${error.message}`);
    console.error('=================================\n');
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed through app termination');
  process.exit(0);
});

export default connectDb;