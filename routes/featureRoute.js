const express = require('express');
const {
  createFeature,
  getAllFeatures,
  getFeatureById,
  getFeaturesByCategory,
  updateFeature,
  deleteFeature,
  archiveFeature
} = require('../controllers/featureController');
const requireDeveloper = require('../middleware/requireDeveloper');

const router = express.Router();

// Public routes (no auth required)
router.get('/', getAllFeatures); // Get all features
router.get('/category/:category', getFeaturesByCategory); // Get features by category
router.get('/:id', getFeatureById); // Get specific feature

// Developer-only routes (require developer privileges)
router.post('/', requireDeveloper, createFeature); // Create new feature - developers only
router.put('/:id', requireDeveloper, updateFeature); // Update feature - developers only
router.delete('/:id', requireDeveloper, deleteFeature); // Delete feature - developers only
router.patch('/:id/archive', requireDeveloper, archiveFeature); // Archive feature - developers only

module.exports = router; 