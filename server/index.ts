import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';

const prisma = new PrismaClient();
const redis = new Redis();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Auth middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Live activity WebSocket
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Broadcast fake activity
setInterval(() => {
  const activities = [
    'John D. invested $500',
    'Emma W. withdrew $1200',
    'Michael K. invested $3000',
    'Sarah L. earned $150 profit',
    'David P. started Professional plan'
  ];
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  io.emit('activity', { message: randomActivity, timestamp: new Date().toISOString() });
}, 3000);

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        referralCode
      }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: 'Login failed' });
  }
});

app.get('/api/dashboard', authenticateToken, async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { investments: true }
  });
  res.json(user);
});

app.post('/api/deposit', authenticateToken, async (req: any, res) => {
  // Stripe/crypto deposit logic
  const { amount, method } = req.body;
  await prisma.transaction.create({
    data: {
      userId: req.user.id,
      type: 'deposit',
      amount,
      status: 'completed'
    }
  });
  io.emit('activity', { message: `${req.user.email} deposited $${amount}` });
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Alpinvest Backend running on port ${PORT}`);
});

