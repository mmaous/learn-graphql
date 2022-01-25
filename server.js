const { ApolloServer, UserInputError, gql } = require('apollo-server');
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core');

const mongoose = require('mongoose');
const Person = require('./models/person');

require('dotenv').config();

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

//* Types/Schema
const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person!
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
`;

//*Resolvers
const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return Person.find({});
      }

      return Person.find({ phone: { $exists: args.phone === 'YES' } });
    },
    findPerson: (root, args) => Person.findOne({ name: args.name }),
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args });
      try {
        await person.save();
      } catch (error) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      }
      return person;
    },

    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name });

      if (!person) {
        throw new UserInputError(
          `No one with the name ${args.name} is available`,
        );
      }
      person.phone = args.phone;
      let updatedPerson = null;

      try {
        updatedPerson = await Person.findByIdAndUpdate(person._id, person, {
          new: true,
        });
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return updatedPerson;
    },
  },
};

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
