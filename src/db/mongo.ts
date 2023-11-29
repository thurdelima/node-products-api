import mongoose, { ConnectOptions } from 'mongoose';

const dbUri = 'mongodb://arthur:arthur@localhost:27017/products_database?authSource=admin';


async function connect() {
  try {
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export default connect;
