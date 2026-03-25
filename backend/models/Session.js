const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  type: String,
  skipped: Boolean,
  score: Number,
  feedback: {
    clarity: String,
    depth: String,
    relevance: String,
    improvements: String,
  }
});

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  totalScore: {
    type: Number,
    default: 0
  },
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);