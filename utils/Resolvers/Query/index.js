const Person = require('../../../models/person');
const { UserInputError } = require('apollo-server');

const personCount = () => Person.collection.countDocuments();

const allPersons = async (root, args) => {
  if (!args.phone) {
    return Person.find({});
  }

  return Person.find({ phone: { $exists: args.phone === 'YES' } });
};

const findPerson = (root, args) => Person.findOne({ name: args.name });

module.exports = { findPerson, allPersons, personCount };
