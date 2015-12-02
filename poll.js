var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
  username: String,
  created_at: Date,
  question: String,
  options: [String],
  votes: [Number]
});

var Poll = mongoose.model('Poll', pollSchema);

// make this available to our users in our Node applications
module.exports = Poll;