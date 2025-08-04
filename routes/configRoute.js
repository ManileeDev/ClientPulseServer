const express = require('express');
const {
  getFeedbackCategories,
  getPriorityOptions,
  getRatingOptions,
  getFeatureCategories,
  getFeatureStatuses,
  getAllConfigurations,
  healthCheck
} = require('../controllers/configController');

const router = express.Router();

// All configuration routes are public (no auth required)
router.get('/', getAllConfigurations); // Get all configurations
router.get('/feedback-categories', getFeedbackCategories); // Get feedback categories
router.get('/priority-options', getPriorityOptions); // Get priority options
router.get('/rating-options', getRatingOptions); // Get rating options
router.get('/feature-categories', getFeatureCategories); // Get feature categories
router.get('/feature-statuses', getFeatureStatuses); // Get feature statuses
router.get('/health', healthCheck); // Health check

module.exports = router; 