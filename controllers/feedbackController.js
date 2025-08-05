const Feedback = require('../models/Feedback');
const Feature = require('../models/Feature');

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    const { featureId, description, category, priority, rating, tags, isAnonymous } = req.body;
    
    console.log('Feedback creation - isAnonymous flag:', isAnonymous);
    console.log('Feedback creation - user name:', req.user.name);
    
    const userId = req.user._id;
    const userEmail = req.user.email;
    const userName = isAnonymous ? "Anonymous" : req.user.name;
    
    console.log('Feedback creation - final userName:', userName);

    // Validate required fields
    if (!featureId || !description || !category || !priority || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Feature, description, category, priority, and rating are required'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Find the selected feature
    const feature = await Feature.findById(featureId);
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Selected feature not found'
      });
    }

    // Generate title from feature name and feedback type
    const title = `Feedback for ${feature.name}`;

    const feedback = new Feedback({
      featureId,
      featureName: feature.name,
      title,
      description,
      category,
      priority,
      rating,
      userId,
      userEmail,
      userName,
      isAnonymous: isAnonymous || false,
      tags: tags || []
    });

    const savedFeedback = await feedback.save();

    // Add feedback to feature's feedback array
    await Feature.findByIdAndUpdate(
      featureId,
      {
        $push: {
          feedback: {
            feedbackId: savedFeedback._id,
            votes: 0
          }
        },
        $inc: {
          'metrics.userRequests': 1
        }
      }
    );

    res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      feedback: savedFeedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create feedback',
      error: error.message
    });
  }
};

// Get all feedback (with optional filtering)
const getAllFeedback = async (req, res) => {
  try {
    const { 
      category, 
      priority, 
      status, 
      userId,
      limit = 50, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    const query = { isArchived: false };
    
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (userId) query.userId = userId;

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const feedback = await Feedback.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('userId', 'name email role');

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      feedback,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id)
      .populate('userId', 'name email role');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Get feedback by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

// Get feedback by user ID
const getFeedbackByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Fetching feedback for user ID:', userId);

    const feedback = await Feedback.find({ 
      userId: userId,
      isArchived: false 
    })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email role');

    console.log('Found feedback count:', feedback.length);

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Get feedback by user ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user feedback',
      error: error.message
    });
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated by users
    delete updates.userId;
    delete updates.userEmail;
    delete updates.userName;
    delete updates.createdAt;
    delete updates.updatedAt;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('userId', 'name email role');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
};

// Update feedback status (for developers)
const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, developerNotes, estimatedHours, actualHours } = req.body;

    const updateData = { status };
    
    if (developerNotes !== undefined) updateData.developerNotes = developerNotes;
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours;
    if (actualHours !== undefined) updateData.actualHours = actualHours;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email role');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback status updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback status',
      error: error.message
    });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Remove feedback from feature's feedback array
    if (feedback.featureId) {
      await Feature.findByIdAndUpdate(
        feedback.featureId,
        {
          $pull: {
            feedback: { feedbackId: id }
          },
          $inc: {
            'metrics.userRequests': -1
          }
        }
      );
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
};

// Archive feedback (soft delete)
const archiveFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback archived successfully',
      feedback
    });
  } catch (error) {
    console.error('Archive feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive feedback',
      error: error.message
    });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  getFeedbackByUserId,
  updateFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  archiveFeedback
}; 