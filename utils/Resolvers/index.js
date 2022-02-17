const Query = require('./queries');
const Mutation = require('./mutations');
const Person = require('../../models/person');
const User = require('../../models/user');
const { UserInputError, AuthenticationError } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();


const addPerson = async (root, args, context) => {
  const person = new Person({ ...args });
  const currentUser = context.currentUser;

  if (!currentUser) {
    throw new AuthenticationError('not authenticated');
  }

  try {
    const user = await User.findOne({ username: currentUser.username });
    console.log(user);
    await person.save();
    user.friends = user.friends.concat(person);
    await user.save();
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args,
    });
  }

  pubsub.publish('PERSON_ADDED', { personAdded: person });

  return person;
};

//*Resolvers
const resolvers = {
  Query,
  Mutation: {
    ...Mutation,
    addPerson,
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator(['PERSON_ADDED']),
    },
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
