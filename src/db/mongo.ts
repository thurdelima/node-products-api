import mongoose, { ConnectOptions } from 'mongoose';




async function connect(uri?: string): Promise<void> {
  try {
    const dbUri = uri || process.env.MONGODB_URI || 'mongodb://arthur:arthur@localhost:27017/products_database?authSource=admin';

    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export default connect;
