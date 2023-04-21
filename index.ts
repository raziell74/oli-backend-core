import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { AuthenticationError } from 'apollo-server-errors';
import cors from 'cors';
import authenticate from './controllers/authController';
import sessionStatus from './controllers/sessionController';
import typeDefs from './schema/typeDefs';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import { conn_core, conn_reports, conn_inspectors } from './environment/connections';
import User, { IUser } from './models/User';
import env from './environment/constants';
import token from './utilities/token';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/authenticate', authenticate);
console.log(`🚀 Authentication endpoint ready at [post]http://localhost:${env.port}/authenticate`);

app.get('/session-status', sessionStatus);
console.log(
  `🚀 User Session Status endpoint ready at [get]http://localhost:${env.port}/session-status`
);

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Subscription,
  },
  csrfPrevention: true,
  cache: 'bounded',
  context: async (ctx) => {
    const jwt = ctx.req.headers.authorization?.split(' ')[1];
    if (!jwt) {
      throw new AuthenticationError('No token provided.');
    }

    let authUserId: string | null = null;
    const verifyPayload = token.verify(jwt);
    switch (verifyPayload.message) {
      case 'Invalid':
        throw new AuthenticationError('Invalid token.');
        break;
      case 'Expired':
        throw new AuthenticationError('Session has expired.');
        break;
      default:
        authUserId = verifyPayload.userId;
    }

    let serverIP = ctx.req.headers.host;
    // Remove existing port for dev builds to only get the host
    serverIP = serverIP?.split(':').shift();

    return {
      ctx,
      ip: serverIP,
      authUserId,
    };
  },
});

console.log('Starting Modified Apollo server...');
(async () => {
  await server.start();
  server.applyMiddleware({ app });

  console.log('Checking database connections...');
  if (!conn_core || !conn_reports || !conn_inspectors) {
    throw new Error('One or more of the database connections has failed.');
  }
  console.log('Database connections successful.');

  // Check for database users with mongo init unencrypted passwords
  const users: IUser[] | null = await User.find({ password: 'change-me' });
  if (env.devPass && users.length > 0) {
    console.log(`Initializing user passwords to '${env.devPass}'`);
    users.map((user: IUser) => {
      user.password = env.devPass || 'olidev';
      user.save();
    });
  }
})();

console.log('Creating server...');
app.listen(env.port, () => {
  console.log(`🚀 GraphQL endpoints ready at http://localhost:${env.port}${server.graphqlPath}`);
});

/** Attempt Graceful shut downs from Container events */
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
