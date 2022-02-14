const Query = require('./Query');
const Mutation = require('./Mutation');

const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

//*Resolvers
const resolvers = {
  Query,
  Mutation,
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator(['PERSON_ADDED'])
    }
  },
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
