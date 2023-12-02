import mongoose from "mongoose";
import connect from "../../../src/db/mongo";



jest.mock('mongoose');

describe('Database connection', () => {

  const originalEnv = process.env;

  beforeAll(() => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test_database';
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({} as mongoose.Mongoose);
  });

  afterAll(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
  });

  it('should connect to MongoDB using provided URI', async () => {
    const logSpy = jest.spyOn(console, 'log');

    const testUri = 'mongodb://localhost:27017/test_database_test';
    await connect(testUri);

    expect(mongoose.connect).toHaveBeenCalledWith(testUri);
    expect(logSpy).toHaveBeenCalledWith('Connected to MongoDB');
  });

  it('should connect to MongoDB using environment variable URI', async () => {
    const logSpy = jest.spyOn(console, 'log');

    await connect();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(logSpy).toHaveBeenCalledWith('Connected to MongoDB');
  });




});
