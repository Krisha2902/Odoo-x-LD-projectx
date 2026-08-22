// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const pool = require('../db'); // Assuming standard pg pool export
const authMiddleware = require('../middleware/auth'); // Standard JWT verification middleware

const nodemailer = require('nodemailer');

const router = express.Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const sendOtpSchema = z.object({
  email: z.string().email(),
});

const verifyOtpSignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  otp: z.string().length(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Configure Nodemailer Transporter
const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

// POST /auth/send-otp (Sign Up Step 1)
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = sendOtpSchema.parse(req.body);

    // 1. Check if email already registered
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: { code: 'EMAIL_IN_USE', message: 'An account with this email already exists.' } });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // 3. Save OTP in store
    await pool.query('INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)', [email, otp, expiresAt]);

    // 4. Send Email or log to console in dev mode
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: '"Ghummy Ghummi ✈️" <GhummyGhmmi@gmail.com>',
        to: email,
        subject: '✈️ Ghummy Ghummi - Your Sign Up OTP Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Welcome to GlobeTrotter! ✈️</h2>
            <p>Your 6-digit email verification OTP code is:</p>
            <h1 style="font-size: 36px; letter-spacing: 6px; color: #0096B4; background: #f0fdfa; padding: 10px 20px; display: inline-block; border-radius: 8px;">${otp}</h1>
            <p>This code expires in 5 minutes. Do not share this code with anyone.</p>
          </div>
        `,
      });
      console.log(`✉️ OTP email sent to ${email}`);
    } else {
      console.log(`📩 [DEV MODE OTP] Email: ${email} | OTP: ${otp}`);
    }

    res.json({
      message: 'OTP sent to email successfully.',
      devOtp: !process.env.SMTP_USER ? otp : undefined, // Pre-fill in dev mode for easy testing
    });
  } catch (error) {
    console.error('❌ Send OTP Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message || 'Failed to send OTP' } });
  }
});

// POST /auth/verify-otp-and-signup (Sign Up Step 2)
router.post('/verify-otp-and-signup', async (req, res) => {
  try {
    const { name, email, password, otp } = verifyOtpSignupSchema.parse(req.body);

    // 1. Verify OTP in store
    const otpRes = await pool.query('SELECT * FROM otps WHERE email = $1', [email]);
    if (otpRes.rows.length === 0) {
      return res.status(400).json({ error: { code: 'INVALID_OTP', message: 'No OTP requested for this email. Please request a new OTP.' } });
    }

    const otpRecord = otpRes.rows[0];
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ error: { code: 'INVALID_OTP', message: 'Incorrect OTP code. Please check your email and try again.' } });
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ error: { code: 'EXPIRED_OTP', message: 'OTP code has expired. Please request a new code.' } });
    }

    // 2. Double check user doesn't already exist
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: { code: 'EMAIL_IN_USE', message: 'Email already exists.' } });
    }

    // 3. Create User & Delete OTP
    const hash = await bcrypt.hash(password, 10);
    const userRes = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hash]
    );

    await pool.query('DELETE FROM otps WHERE email = $1', [email]);

    const user = userRes.rows[0];
    const secret = process.env.JWT_SECRET || 'globetrotter_super_secret_jwt_key_2026';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('❌ Verify OTP & Signup Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message || 'Signup failed' } });
  }
});

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: { code: 'EMAIL_IN_USE', message: 'Email already exists' } });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hash]
    );

    const user = result.rows[0];
    const secret = process.env.JWT_SECRET || 'globetrotter_super_secret_jwt_key_2026';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('❌ Signup Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message || 'Internal server error' } });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    }

    const secret = process.env.JWT_SECRET || 'globetrotter_super_secret_jwt_key_2026';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
    
    // Omit password hash from response
    delete user.password_hash;
    res.json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
});

// GET /auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
});

module.exports = router;