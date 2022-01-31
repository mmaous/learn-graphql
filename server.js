const { ApolloServer } = require('apollo-server');
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const resolvers = require('./utils/Resolvers');
const typeDefs = require('./utils/types');
const User = require('./models/user');

// ENV variables
const DB_URL = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('connecting to db...', );

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
   context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
    return null;
  },
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
