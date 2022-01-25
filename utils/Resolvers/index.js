const Query = require('./Query');
const Mutation = require('./Mutation');

//*Resolvers
const resolvers = {
  Query,
  Mutation,
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

module.exports = resolvers;
