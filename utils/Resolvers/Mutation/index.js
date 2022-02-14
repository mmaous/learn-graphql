const Person = require('../../../models/person');
const User = require('../../../models/user');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const JWT_SECRET = process.env.JWT_SECRET;

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

  pubsub.publish('PERSON_ADDED', { personAdded: person })
  return person;
};

const editNumber = async (root, args) => {
  const person = await Person.findOne({ name: args.name });

  if (!person) {
    throw new UserInputError(`No one with the name ${args.name} is available`);
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
};

const createUser = async (root, args) => {
  const user = new User({ username: args.username });

  try {
    return await user.save();
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args,
    });
  }
};

const login = async (root, args) => {
  const user = await User.findOne({ username: args.username });

  if (!user || args.password !== 'secret') {
    throw new UserInputError('Wrong Credentials!');
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  return { value: jwt.sign(userForToken, JWT_SECRET) };
};

const addAsFriend = async (root, args, { currentUser }) => {

  const nonFriendAlready = (person) =>
    !currentUser.friends.map((f) => f._id).includes(person._id);
  if (!currentUser) {
    throw new AuthenticationError('not authenticated');
  }
  const person = await Person.findOne({ name: args.name });
  if (nonFriendAlready(person)) {
    currentUser.friends = currentUser.friends.concat(person);
  }

  await currentUser.save();

  return currentUser;
};


module.exports = { addPerson, editNumber, createUser, login, addAsFriend };
