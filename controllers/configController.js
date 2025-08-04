// Configuration controller for dynamic data
// This controller provides configuration data for the frontend

// Feedback categories configuration
const getFeedbackCategories = async (req, res) => {
  try {
    const categories = [
      {
        value: 'bug',
        name: 'Bug Report',
        description: 'Report issues, errors, or unexpected behavior',
        color: '#EF4444'
      },
      {
        value: 'feature',
        name: 'Feature Request',
        description: 'Suggest new features or enhancements',
        color: '#3B82F6'
      },
      {
        value: 'ui',
        name: 'UI/UX Feedback',
        description: 'Comments on user interface and experience',
        color: '#8B5CF6'
      },
      {
        value: 'performance',
        name: 'Performance',
        description: 'Speed, loading, or performance-related feedback',
        color: '#F59E0B'
      },
      {
        value: 'other',
        name: 'Other',
        description: 'General feedback that doesn\'t fit other categories',
        color: '#6B7280'
      }
    ];

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get feedback categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback categories',
      error: error.message
    });
  }
};

// Priority options configuration
const getPriorityOptions = async (req, res) => {
  try {
    const priorities = [
      {
        value: 'low',
        name: 'Low',
        description: 'Nice to have, not urgent',
        color: '#10B981',
        order: 1
      },
      {
        value: 'medium',
        name: 'Medium',
        description: 'Important but not critical',
        color: '#F59E0B',
        order: 2
      },
      {
        value: 'high',
        name: 'High',
        description: 'Important and should be addressed soon',
        color: '#EF4444',
        order: 3
      },
      {
        value: 'urgent',
        name: 'Urgent',
        description: 'Critical issue requiring immediate attention',
        color: '#DC2626',
        order: 4
      }
    ];

    res.json({
      success: true,
      priorities
    });
  } catch (error) {
    console.error('Get priority options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch priority options',
      error: error.message
    });
  }
};

// Rating options configuration
const getRatingOptions = async (req, res) => {
  try {
    const ratings = [
      {
        value: 1,
        name: 'Very Poor',
        description: 'Extremely dissatisfied',
        emoji: '😞',
        color: '#DC2626'
      },
      {
        value: 2,
        name: 'Poor',
        description: 'Dissatisfied',
        emoji: '😔',
        color: '#EF4444'
      },
      {
        value: 3,
        name: 'Okay',
        description: 'Neutral/Average',
        emoji: '😐',
        color: '#F59E0B'
      },
      {
        value: 4,
        name: 'Good',
        description: 'Satisfied',
        emoji: '😊',
        color: '#3B82F6'
      },
      {
        value: 5,
        name: 'Excellent',
        description: 'Very satisfied',
        emoji: '😍',
        color: '#10B981'
      }
    ];

    res.json({
      success: true,
      ratings
    });
  } catch (error) {
    console.error('Get rating options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rating options',
      error: error.message
    });
  }
};

// Feature categories configuration
const getFeatureCategories = async (req, res) => {
  try {
    const categories = [
      {
        value: 'ui',
        name: 'User Interface',
        description: 'Frontend, design, and user experience improvements',
        color: '#8B5CF6'
      },
      {
        value: 'backend',
        name: 'Backend',
        description: 'Server-side functionality and APIs',
        color: '#059669'
      },
      {
        value: 'integration',
        name: 'Integration',
        description: 'Third-party services and external APIs',
        color: '#DC2626'
      },
      {
        value: 'analytics',
        name: 'Analytics',
        description: 'Data tracking, reporting, and insights',
        color: '#7C3AED'
      },
      {
        value: 'security',
        name: 'Security',
        description: 'Authentication, authorization, and data protection',
        color: '#B91C1C'
      },
      {
        value: 'performance',
        name: 'Performance',
        description: 'Speed, optimization, and scalability improvements',
        color: '#F59E0B'
      },
      {
        value: 'other',
        name: 'Other',
        description: 'General features that don\'t fit other categories',
        color: '#6B7280'
      }
    ];

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get feature categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feature categories',
      error: error.message
    });
  }
};

// Feature status options
const getFeatureStatuses = async (req, res) => {
  try {
    const statuses = [
      {
        value: 'planned',
        name: 'Planned',
        description: 'Feature is planned for development',
        color: '#6B7280'
      },
      {
        value: 'in_development',
        name: 'In Development',
        description: 'Currently being developed',
        color: '#F59E0B'
      },
      {
        value: 'testing',
        name: 'Testing',
        description: 'Under testing and quality assurance',
        color: '#8B5CF6'
      },
      {
        value: 'completed',
        name: 'Completed',
        description: 'Feature has been completed and deployed',
        color: '#10B981'
      },
      {
        value: 'cancelled',
        name: 'Cancelled',
        description: 'Feature development has been cancelled',
        color: '#EF4444'
      }
    ];

    res.json({
      success: true,
      statuses
    });
  } catch (error) {
    console.error('Get feature statuses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feature statuses',
      error: error.message
    });
  }
};

// All configurations in one endpoint
const getAllConfigurations = async (req, res) => {
  try {
    // Get all configuration data
    const feedbackCategoriesResponse = await new Promise((resolve) => {
      getFeedbackCategories({ query: {} }, { json: resolve });
    });
    
    const priorityOptionsResponse = await new Promise((resolve) => {
      getPriorityOptions({ query: {} }, { json: resolve });
    });
    
    const ratingOptionsResponse = await new Promise((resolve) => {
      getRatingOptions({ query: {} }, { json: resolve });
    });
    
    const featureCategoriesResponse = await new Promise((resolve) => {
      getFeatureCategories({ query: {} }, { json: resolve });
    });
    
    const featureStatusesResponse = await new Promise((resolve) => {
      getFeatureStatuses({ query: {} }, { json: resolve });
    });

    res.json({
      success: true,
      configurations: {
        feedbackCategories: feedbackCategoriesResponse.categories,
        priorityOptions: priorityOptionsResponse.priorities,
        ratingOptions: ratingOptionsResponse.ratings,
        featureCategories: featureCategoriesResponse.categories,
        featureStatuses: featureStatusesResponse.statuses
      }
    });
  } catch (error) {
    console.error('Get all configurations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configurations',
      error: error.message
    });
  }
};

// Health check endpoint
const healthCheck = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
};

module.exports = {
  getFeedbackCategories,
  getPriorityOptions,
  getRatingOptions,
  getFeatureCategories,
  getFeatureStatuses,
  getAllConfigurations,
  healthCheck
}; 