const Player = require('../models/player');

// Get all players
exports.getPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new player
exports.addPlayer = async (req, res) => {
  const { name, role, matches, runs, wickets } = req.body;

  const player = new Player({ name, role, matches, runs, wickets });
  try {
    const savedPlayer = await player.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};