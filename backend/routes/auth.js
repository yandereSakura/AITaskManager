const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const { authenticator } = require('otplib');
const pool = require('../db/pool');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Допускаем код из соседнего 30-секундного окна (небольшая разница часов)
authenticator.options = { window: 1 };

// Регистрация: хэш пароля + TOTP-секрет + QR-код
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || password.length < 6) {
      return res.status(400).json({ error: 'Нужны имя и пароль (минимум 6 символов)' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const secret = authenticator.generateSecret();
    await pool.query(
      'INSERT INTO users (username, password_hash, totp_secret) VALUES ($1, $2, $3)',
      [username, passwordHash, secret]
    );
    const otpauth = authenticator.keyuri(username, 'TaskManager', secret);
    const qr = await QRCode.toDataURL(otpauth);
    res.status(201).json({ message: 'Пользователь создан', secret, qr });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Такой пользователь уже существует' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Вход, шаг 1: проверка пароля
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }
    const preToken = jwt.sign({ id: user.id, step: 'mfa' }, JWT_SECRET, { expiresIn: '5m' });
    res.json({ mfaRequired: true, preToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Вход, шаг 2: проверка одноразового кода
router.post('/login/mfa', async (req, res) => {
  try {
    const { preToken, code } = req.body;
    let payload;
    try {
      payload = jwt.verify(preToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Время входа истекло, начните заново' });
    }
    if (payload.step !== 'mfa') {
      return res.status(401).json({ error: 'Неверный токен' });
    }
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [payload.id]);
    const user = result.rows[0];
    if (!user || !authenticator.check(String(code || ''), user.totp_secret)) {
      return res.status(401).json({ error: 'Неверный код' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Проверка: кто вошёл (только с полным токеном)
router.get('/me', (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.step) throw new Error('pre-auth token');
    res.json({ id: payload.id, username: payload.username });
  } catch {
    res.status(401).json({ error: 'Не авторизован' });
  }
});

module.exports = router;
