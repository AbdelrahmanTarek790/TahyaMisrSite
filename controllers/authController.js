const User = require('../models/User');
const Position = require('../models/Position');
const { generateToken } = require('../middleware/auth');
const { registerSchema, loginSchema, updateUserSchema } = require('../utils/validation');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    const {
      name,
      email,
      password,
      phone,
      university,
      nationalId,
      governorate,
      position,
      membershipNumber,
      membershipExpiry
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { nationalId }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email or national ID',
        data: null
      });
    }

    // Validate position if provided
    if (position) {
      const validPosition = await Position.findById(position);
      if (!validPosition || !validPosition.isActive) {
        return res.status(400).json({
          success: false,
          error: 'Invalid position selected',
          data: null
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      university,
      nationalId,
      governorate,
      position,
      membershipNumber,
      membershipExpiry
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).populate('position');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        data: null
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        data: null
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        token,
        user
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/v1/users/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('position');

    res.status(200).json({
      success: true,
      data: user,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user
// @route   PUT /api/v1/users/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    // Validate input
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    // Validate position if provided
    if (req.body.position) {
      const validPosition = await Position.findById(req.body.position);
      if (!validPosition || !validPosition.isActive) {
        return res.status(400).json({
          success: false,
          error: 'Invalid position selected',
          data: null
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('position');

    res.status(200).json({
      success: true,
      data: user,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe
};