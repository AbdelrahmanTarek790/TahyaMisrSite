const User = require('../models/User');
const Position = require('../models/Position');
const { generateToken } = require('../middleware/auth');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } = require('../utils/validation');
const { sendResetPasswordEmail } = require('../utils/email');
const upload = require('../utils/upload');
const crypto = require('crypto');
const path = require('path');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    // Only validate with Joi if not a file upload (FormData)
    const isFormData = req.headers['content-type']?.includes('multipart/form-data');
    
    if (!isFormData) {
      // Validate input for regular JSON
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message,
          data: null
        });
      }
    } else {
      // Basic validation for FormData
      const requiredFields = ['name', 'email', 'password', 'phone', 'university', 'nationalId', 'governorate'];
      for (const field of requiredFields) {
        if (!req.body[field] || req.body[field].trim() === '') {
          return res.status(400).json({
            success: false,
            error: `${field} is required`,
            data: null
          });
        }
      }
      
      // Check if profile image is provided
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Profile image is required',
          data: null
        });
      }
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

    // Handle profile image upload if provided
    let profileImagePath = null;
    if (req.file) {
      profileImagePath = req.file.filename;
    }

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
      membershipExpiry,
      profileImage: profileImagePath
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
    // Check if this is a file upload (FormData)
    const isFormData = req.headers['content-type']?.includes('multipart/form-data');
    
    if (!isFormData) {
      // Regular JSON update - validate input
      const { updateUserSchema } = require('../utils/validation');
      const { error } = updateUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message,
          data: null
        });
      }
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

    // Prepare update data
    const updateData = { ...req.body };
    
    // Handle profile image upload if provided
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('position');

    res.status(200).json({
      success: true,
      data: { user },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    // Validate input
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found with this email',
        data: null
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    // Save user with reset token
    await user.save({ validateBeforeSave: false });

    // Send email with reset token
    const emailResult = await sendResetPasswordEmail(email, resetToken);

    if (!emailResult.success) {
      // Reset the token fields if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        error: 'Email could not be sent',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Password reset email sent'
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    // Validate input
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    const { token, password } = req.body;

    // Hash the token to compare with stored token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
        data: null
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    // Generate new JWT token
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        message: 'Password reset successful',
        token: jwtToken,
        user
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    // Validate input
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        data: null
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password field
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect',
        data: null
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    // Generate new JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        message: 'Password changed successfully',
        token
      },
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
  updateMe,
  forgotPassword,
  resetPassword,
  changePassword
};