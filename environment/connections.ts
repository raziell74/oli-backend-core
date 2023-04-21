import env from './constants';
import mongoose from 'mongoose';

/**
 * Gets the correct db connection. If running in a
 * test environment it will return the core mongoose.connection
 * for running local memory mongo db testing stub
 * @param uri string
 * @returns mongoose.Connection
 */
const getConnection = (uri: string) => {
  const isTestEnv = process.env.NODE_ENV === 'test';
  return isTestEnv ? mongoose.connection : mongoose.createConnection(uri);
};

export const conn_core = getConnection(`${env.coreDbUrl}${env.coreDb}`);
export const conn_reports = getConnection(`${env.coreDbUrl}${env.reportsDb}`);
export const conn_inspectors = getConnection(`${env.coreDbUrl}${env.inspectorsDb}`);
