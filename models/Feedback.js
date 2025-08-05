const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  featureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feature',
    required: true
  },
  featureName: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['bug', 'feature', 'ui', 'performance', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in_progress', 'resolved', 'closed'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  developerNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ category: 1, status: 1 });
feedbackSchema.index({ priority: 1, createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema); 