const express = require('express');
const {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  getFeedbackByUserId,
  updateFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  archiveFeedback
} = require('../controllers/feedbackController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Public routes (no auth required)
router.get('/', getAllFeedback); // Get all feedback (for developer dashboard)

// Protected routes (require authentication)
router.post('/', requireAuth, createFeedback); // Create new feedback
router.get('/user/:userId', requireAuth, getFeedbackByUserId); // Get feedback by user ID
router.get('/:id', requireAuth, getFeedbackById); // Get specific feedback
router.put('/:id', requireAuth, updateFeedback); // Update feedback
router.put('/:id/status', requireAuth, updateFeedbackStatus); // Update feedback status (developers)
router.delete('/:id', requireAuth, deleteFeedback); // Delete feedback
router.patch('/:id/archive', requireAuth, archiveFeedback); // Archive feedback

module.exports = router; 