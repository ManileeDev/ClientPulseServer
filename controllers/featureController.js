const Feature = require('../models/Feature');

// Create new feature
const createFeature = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      priority, 
      estimatedHours,
      startDate,
      targetDate,
      tags,
      assignedTo
    } = req.body;

    // Validate required fields
    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and category are required'
      });
    }

    const feature = new Feature({
      name,
      description,
      category,
      priority: priority || 'medium',
      estimatedHours,
      startDate,
      targetDate,
      tags: tags || [],
      assignedTo
    });

    const savedFeature = await feature.save();

    res.status(201).json({
      success: true,
      message: 'Feature created successfully',
      feature: savedFeature
    });
  } catch (error) {
    console.error('Create feature error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create feature',
      error: error.message
    });
  }
};

// Get all features (with optional filtering)
const getAllFeatures = async (req, res) => {
  try {
    const { 
      category, 
      status, 
      priority,
      assignedTo,
      limit = 50, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    const query = { isArchived: false };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const features = await Feature.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('assignedTo', 'name email role')
      .populate('feedback.feedbackId', 'title rating description priority');

    const total = await Feature.countDocuments(query);

    // Calculate feedback count and average rating for each feature
    const featuresWithStats = features.map(feature => {
      const featureObj = feature.toObject();
      
      // Filter out null/undefined feedback entries
      const validFeedback = featureObj.feedback.filter(fb => fb.feedbackId && fb.feedbackId.rating);
      
      // Calculate feedback count
      featureObj.feedbackCount = validFeedback.length;
      
      // Calculate average rating
      if (validFeedback.length > 0) {
        const totalRating = validFeedback.reduce((sum, fb) => sum + fb.feedbackId.rating, 0);
        featureObj.avgRating = totalRating / validFeedback.length;
      } else {
        featureObj.avgRating = 0;
      }
      
      return featureObj;
    });

    res.json({
      success: true,
      features: featuresWithStats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all features error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch features',
      error: error.message
    });
  }
};

// Get feature by ID
const getFeatureById = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await Feature.findById(id)
      .populate('assignedTo', 'name email role')
      .populate('feedback.feedbackId', 'title rating description userId priority')
      .populate('dependencies.featureId', 'name status');

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }

    // Calculate feedback stats
    const featureObj = feature.toObject();
    const validFeedback = featureObj.feedback.filter(fb => fb.feedbackId && fb.feedbackId.rating);
    
    featureObj.feedbackCount = validFeedback.length;
    
    if (validFeedback.length > 0) {
      const totalRating = validFeedback.reduce((sum, fb) => sum + fb.feedbackId.rating, 0);
      featureObj.avgRating = totalRating / validFeedback.length;
    } else {
      featureObj.avgRating = 0;
    }

    res.json({
      success: true,
      feature: featureObj
    });
  } catch (error) {
    console.error('Get feature by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feature',
      error: error.message
    });
  }
};

// Get features by category
const getFeaturesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const features = await Feature.find({ 
      category: category,
      isArchived: false 
    })
    .sort({ priority: -1, createdAt: -1 })
    .populate('assignedTo', 'name email role')
    .populate('feedback.feedbackId', 'title rating description priority');

    // Calculate feedback stats for each feature
    const featuresWithStats = features.map(feature => {
      const featureObj = feature.toObject();
      const validFeedback = featureObj.feedback.filter(fb => fb.feedbackId && fb.feedbackId.rating);
      
      featureObj.feedbackCount = validFeedback.length;
      
      if (validFeedback.length > 0) {
        const totalRating = validFeedback.reduce((sum, fb) => sum + fb.feedbackId.rating, 0);
        featureObj.avgRating = totalRating / validFeedback.length;
      } else {
        featureObj.avgRating = 0;
      }
      
      return featureObj;
    });

    res.json({
      success: true,
      features: featuresWithStats
    });
  } catch (error) {
    console.error('Get features by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch features by category',
      error: error.message
    });
  }
};

// Update feature
const updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle status transitions
    if (updates.status === 'completed' && !updates.completedDate) {
      updates.completedDate = new Date();
    }

    // Remove fields that shouldn't be updated
    delete updates.createdAt;
    delete updates.updatedAt;

    const feature = await Feature.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email role')
    .populate('feedback.feedbackId', 'title rating');

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }

    res.json({
      success: true,
      message: 'Feature updated successfully',
      feature
    });
  } catch (error) {
    console.error('Update feature error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feature',
      error: error.message
    });
  }
};

// Delete feature
const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await Feature.findByIdAndDelete(id);

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }

    res.json({
      success: true,
      message: 'Feature deleted successfully'
    });
  } catch (error) {
    console.error('Delete feature error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feature',
      error: error.message
    });
  }
};

// Archive feature (soft delete)
const archiveFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await Feature.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found'
      });
    }

    res.json({
      success: true,
      message: 'Feature archived successfully',
      feature
    });
  } catch (error) {
    console.error('Archive feature error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive feature',
      error: error.message
    });
  }
};

module.exports = {
  createFeature,
  getAllFeatures,
  getFeatureById,
  getFeaturesByCategory,
  updateFeature,
  deleteFeature,
  archiveFeature
}; 