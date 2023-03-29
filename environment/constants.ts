/** Pulls and Defines environmental constants for the API */

export default {
  port: Number(process.env.PORT) || 3000,

  coreDbUrl: process.env.COREDB_URL || 'mongodb://mongo1/',

  coreDb: process.env.DB_CORE || 'core',
  coreDbUser: process.env.COREDB_USER || 'core-user',
  coreDbPass: process.env.COREDB_PASSWORD || 'olidev',

  reportsDb: process.env.DB_REPORTS || 'reports',
  reportsDbUser: process.env.COREDB_USER || 'reports-user',
  reportsDbPass: process.env.COREDB_PASSWORD || 'olidev',

  inspectorsDb: process.env.DB_INSPECTORS || 'inspectors',
  inspectorsDbUser: process.env.COREDB_USER || 'inspectors-user',
  inspectorsDbPass: process.env.COREDB_PASSWORD || 'olidev',

  redisHost: process.env.REDIS_HOST || 'redis://redis_db',
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisPass: process.env.REDIS_PASSWORD || 'olidev',
};
