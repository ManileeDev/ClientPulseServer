const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    enum: ['feature', 'story', 'bug', 'documentation'],
    default: 'feature'
  },
  status: {
    type: String,
    required: true,
    enum: ['planned', 'in_development', 'testing', 'completed', 'cancelled'],
    default: 'completed'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  version: {
    type: String,
    trim: true
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  startDate: {
    type: Date
  },
  targetDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  dependencies: [{
    featureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feature'
    },
    type: {
      type: String,
      enum: ['blocks', 'depends_on'],
      default: 'depends_on'
    }
  }],
  feedback: [{
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback'
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  metrics: {
    userRequests: {
      type: Number,
      default: 0
    },
    votes: {
      type: Number,
      default: 0
    },
    complexity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    }
  },
  documentation: {
    specUrl: String,
    designUrl: String,
    testPlanUrl: String
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
featureSchema.index({ status: 1, priority: 1 });
featureSchema.index({ category: 1, createdAt: -1 });
featureSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model("Feature", featureSchema); 