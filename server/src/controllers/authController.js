// src/controllers/authController.js
const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ userId: id, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });
        
        const user = await User.create({ name, email, password });
        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                token: generateToken(user._id, user.role),
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
