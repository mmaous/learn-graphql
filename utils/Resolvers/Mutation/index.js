const Person = require('../../../models/person');
const User = require('../../../models/user');
const { UserInputError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const addPerson = async (root, args) => {
  const person = new Person({ ...args });
  try {
    await person.save();
  } catch (error) {
    throw new UserInputError(err.message, {
      invalidArgs: args,
    });
  }
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

module.exports = { addPerson, editNumber, createUser, login };
