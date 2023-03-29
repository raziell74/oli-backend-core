import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { authenticate, checkSession } from './controllers/authenticate';
import typeDefs from './schema/typeDefs';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import { createServer } from 'http';
import { conn_core, conn_reports, conn_inspectors, cache } from './environment/connections';
import env from './environment/constants';

(async () => {
  const app = express();
  app.use(cors());
  app.use(express.json);
  app.post('/authenticate', authenticate);
  app.post('/checksession', checkSession);

  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
      Subscription,
    },
    csrfPrevention: true,
    cache: 'bounded',
    context: (request) => {
      let serverIP = request.req.headers.host;

      // Remove existing port for dev builds to only get the host
      serverIP = serverIP?.split(':').shift();

      return {
        request,
        ip: serverIP,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });
  const httpServer = createServer(app);

  const shutdown = () => {
    if (server) {
      server.stop();
      process.exit();
    }
  };

  process.on('SIGINT', () => {
    console.error('Got SIGINT (aka ctrl-c in docker). Gracefully shutting down...');
    shutdown();
  });

  process.on('SIGTERM', () => {
    console.error('Got SIGTERM (docker container stop). Gracefully shutting down...');
    shutdown();
  });

  console.log('Checking database connections...');
  if (!conn_core || !conn_reports || !conn_inspectors || !cache) {
    throw new Error('One or more of the database connections has failed.');
  }
  console.log('Database connections successful.');

  console.log('Creating server...');

  // Modified server startup
  await new Promise<void>(() =>
    httpServer.listen(env.port, () => {
      console.log(
        `🚀 GraphQL endpoints ready at http://localhost:${env.port}${server.graphqlPath}`
      );
    })
  );
})();