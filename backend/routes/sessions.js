const express = require('express');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Save a session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { topic, difficulty, totalScore, questions } = req.body;
    const session = await Session.create({
      userId: req.user.userId,
      topic,
      difficulty,
      totalScore,
      questions
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all sessions for logged in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;