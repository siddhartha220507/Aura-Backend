const express = require('express');
const cors = require('cors');
const startMidnightWatcher = require('./cron/watcher');

const app = express();
startMidnightWatcher();

app.use(cors({
  // 🚨 '*' hata diya hai, aur tumhara Vercel URL add kar diya hai
  origin: [
    'http://localhost:5173', 
    'https://vercel.com/siddhartha220507s-projects/a-ura-meter-frontend-faa3/3nhKU3vz9arY7ZNEfzTV9HT3VUfp', // Yahan apna Asli Vercel URL daalna (bina end slash '/')
    'https://a-ura-meter-frontend-faa3.vercel.app/' // Agar tumne custom domain lagaya hai toh wo bhi add kar do
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS request zaruri hai preflight ke liye
  allowedHeaders: ['Content-Type', 'Authorization'] // Google auth tokens in headers mein aate hain
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