const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const mongoose = require('mongoose');
require('dotenv').config();


const resolvers = require('./utils/Resolvers');
const typeDefs = require('./utils/types');


const DB_URL = process.env.MONGODB_URI;

console.log('connecting to ', DB_URL);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.error(err.message));


//* init Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

/*
 * listens on the server (defaultPort= 4000)
 */

server
  .listen()
  .then(({ port, url }) =>
    console.log(`Server is listening \n PORT ${port} \n URL : ${url} `),
  );
