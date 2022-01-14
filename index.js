const { ApolloServer, UserInputError, gql} = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { v1: uuid} = require('uuid');


//* data
let persons = [
  {
    name: 'Arto Hellas',
    phone: '040-123543',
    street: 'Tapiolankatu 5 A',
    city: 'Espoo',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Matti Luukkainen',
    phone: '040-432342',
    street: 'Malminkaari 10 A',
    city: 'Helsinki',
    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Venla Ruuska',
    street: 'Nallemäentie 22 C',
    city: 'Helsinki',
    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
  },
];

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
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson (
      name: String!
      phone: String
      street: String!
      city: String!
    ) : Person
  }
`;

//*Resolvers
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) {
        return persons;
      };
      const byPhone = (person) => args.phone === 'YES' ? person.phone : !person.phone;
      return persons.filter(byPhone);
    },
    findPerson: (root, args) => persons.find((p) => p.name === args.name)
  },
  Person: {
    address: (root) => {
      return { 
        street: root.street,
        city: root.city 
      }
    }
  },
  Mutation: {
    addPerson: (root, args) => {

      if (persons.find(p => p.name === args.name)) {
        throw new UserInputError('Name must be Unique', {
          invalidArgs: args.name,
        })
      }
      const person = {...args, id: uuid()}
      persons.concat(person)
      return person;
    }
  }
}

//* init Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ]
})


/** 
* @listens on the server (defaultPort= 4000)
*/ 

server
  .listen()
  .then(({ port, url }) =>
    console.log(`Server is listening \n PORT ${port} \n URL : ${url} `),
  );

// console.log(typeof server);
// console.log(server);