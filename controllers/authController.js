const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken.js');
const { sendWelcomeEmail, sendNewUserNotification, sendPasswordResetCodeEmail } = require('../utils/wemailService.js');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const {
        firstName, lastName, dob, contactNumber, address,
        profileImageURL, email, username, password
    } = req.body;

    if (!firstName || !lastName || !email || !username || !password) {
        return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            firstName, lastName, dob, contactNumber, address,
            profileImageURL: profileImageURL || '',
            email, username, passwordHash,
        });

        const newUser = await user.save();

        if (newUser) {
            try {
                await sendWelcomeEmail(newUser.email, newUser.username);
                await sendNewUserNotification(newUser);
            } catch (emailError) {
                console.error('Failed to send registration emails:', emailError);
                // We don't block the registration if emails fail, but we log the error.
                // You might want to add more robust error handling here, like a retry queue.
            }

            res.status(201).json({
                message: 'User registered successfully! Please check your email to verify your account.',
                user: { _id: newUser._id, username: newUser.username, email: newUser.email }
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { loginIdentifier, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
        });
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email/username or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Request password reset code
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'If a user with that email exists, a reset code has been sent.' });
        }
        
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.passwordResetCode = resetCode;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await user.save();
        
        await sendPasswordResetCodeEmail(user.email, resetCode);
        
        res.json({ message: 'A reset code has been sent to your email.' });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reset password using code
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, code, password } = req.body;
    try {
        const user = await User.findOne({ 
            email, 
            passwordResetCode: code,
            passwordResetExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);
        
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        
        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
};
