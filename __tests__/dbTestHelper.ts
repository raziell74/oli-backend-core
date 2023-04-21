import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const mongod = new MongoMemoryServer();

async function connect() {
  await mongod.start(); // Start the MongoDB server before getting the URI
  const uri = await mongod.getUri();
  return await mongoose.connect(uri);
}

async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

export default {
  connect,
  closeDatabase,
  clearDatabase,
};
