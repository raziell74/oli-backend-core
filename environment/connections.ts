import env from './constants';
import mongoose from 'mongoose';
import * as redis from 'redis';

export const conn_core = mongoose.createConnection(`${env.coreDbUrl}${env.coreDb}`, {
  replicaSet: 'rs0',
});

export const conn_reports = mongoose.createConnection(`${env.coreDbUrl}${env.reportsDb}`, {
  replicaSet: 'rs0',
});

export const conn_inspectors = mongoose.createConnection(`${env.coreDbUrl}${env.inspectorsDb}`, {
  replicaSet: 'rs0',
});

export const cache = redis.createClient({
  socket: {
    host: env.redisHost,
    port: env.redisPort,
  },
  password: env.redisPass,
});

cache.on('error', (err) => {
  console.log('Error ' + err);
});
