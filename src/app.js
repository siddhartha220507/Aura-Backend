const express = require('express');
const cors = require('cors');
const startMidnightWatcher = require('./cron/watcher');

const app = express();
startMidnightWatcher();

// 🚨 THE ULTIMATE VERCEL CORS BYPASS
app.use(cors({
  origin: function (origin, callback) {
    // 1. Agar local testing chal rahi hai
    // 2. Ya kisi bhi Vercel URL se request aa rahi hai
    // Toh usko automatically allow kar do!
    if (!origin || origin.includes('localhost') || origin.includes('vercel.app')) {
      callback(null, origin); // Ye browser ko uska exact origin pass kar deta hai
    } else {
      callback(new Error('Not allowed by CORS Bouncer'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));



const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const postRoutes = require('./routes/postRoutes');
const focusRoutes = require('./routes/focusRoutes');
const adminRoutes = require('./routes/admin.route');


app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/dreams', require('./routes/dreamRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', adminRoutes);

const { errorHandler } = require('./middlewares/errorMiddleware');
app.use(errorHandler);


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Aura Backend Engine is running smoothly... 🚀' });
});

module.exports = app;