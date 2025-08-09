const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  matches: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
});

module.exports = mongoose.model('Player', playerSchema);