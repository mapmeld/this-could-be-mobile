const mongoose = require('mongoose');

var styleSchema = mongoose.Schema({
  src: String,
  url: String
});

module.exports = mongoose.model('Style', styleSchema);
