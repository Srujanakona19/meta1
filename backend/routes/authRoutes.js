const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbPromise = require('../config/db');
const { JWT_SECRET, protect } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ detail: "Email and password are required" });
  }

  try {
    const pool = await dbPromise;
    
    // Check if user exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ detail: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, firstName || '', lastName || '']
    );

    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: result.insertId, email, firstName, lastName }
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ detail: "Email and password are required" });
  }

  try {
    const pool = await dbPromise;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name }
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// GET current profile
router.get('/me', protect, async (req, res) => {
  try {
    const pool = await dbPromise;
    const [rows] = await pool.query('SELECT id, email, first_name, last_name, created_at FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ detail: 'User not found' });
    }
    const u = rows[0];
    res.json({ id: u.id, email: u.email, firstName: u.first_name, lastName: u.last_name, createdAt: u.created_at });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Update Profile
router.put('/profile', protect, async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const pool = await dbPromise;
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
      [firstName || '', lastName || '', req.user.id]
    );

    const [rows] = await pool.query('SELECT id, email, first_name, last_name FROM users WHERE id = ?', [req.user.id]);
    const u = rows[0];
    res.json({
      message: 'Profile updated successfully',
      user: { id: u.id, email: u.email, firstName: u.first_name, lastName: u.last_name }
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Update Password
router.put('/password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ detail: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ detail: 'New password must be at least 6 characters' });
  }

  try {
    const pool = await dbPromise;
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ detail: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ detail: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
