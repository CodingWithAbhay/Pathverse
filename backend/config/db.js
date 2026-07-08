import mongoose from 'mongoose';

/**
 * Initializes connection to the MongoDB database using mongoose.
 */
export const connectDB = async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathfinder';
  
  try {
    const conn = await mongoose.connect(connString);
    console.log(`[MongoDB Connection] Successful: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n⚠️  [MongoDB Connection] Failed to Connect! ⚠️');
    console.error(`Error details: ${error.message}`);
    console.error('\nHOW TO FIX:');
    console.error('1. Make sure your local MongoDB Server is running.');
    console.error('   - On Windows: Open Services, find "MongoDB Server" and click Start.');
    console.error('   - On macOS/Linux: Run "brew services start mongodb-community" or "sudo systemctl start mongod".');
    console.error('2. Alternatively, set MONGODB_URI in server/.env to a remote MongoDB Atlas connection string.');
    console.error('   Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pathfinder\n');
    
    // In local dev, do not crash the Node process, let the server listen so the developer gets a responsive error message.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
