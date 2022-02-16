const mongoose = require('mongoose');
const UniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  phone: {
    type: String,
    minilength:5
  },
  street: {
    type: String,
    required: true,
    minlength: 3
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
})

schema.plugin(UniqueValidator);

module.exports = mongoose.model('Person', schema)
