const Person = require('../../models/person');

const personCount = () => Person.collection.countDocuments();

const allPersons = async (root, args) => {
  if (!args.phone) {
    return Person.find({});
  }

  return Person.find({ phone: { $exists: args.phone === 'YES' } });
};

const findPerson = (root, args) => {
  return Person.findOne({ name: args.name });
};

const me = (root, args, context) => {
  return context.currentUser;
};

module.exports = { findPerson, allPersons, personCount, me };
