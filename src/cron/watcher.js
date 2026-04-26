const cron = require('node-cron');
const User = require('../models/user.model');

const startMidnightWatcher = () => {
  // Ye syntax cron ka hai: 'Min Hr Day Mth DayOfWeek' -> '59 23 * * *' = 11:59 PM Everyday
  cron.schedule('59 23 * * *', async () => {
    console.log('[SYSTEM] 🌙 Midnight Watcher Activated. Scanning lazy agents...');
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Aaj ki shuruaat (Midnight)

      // Un users ko dhundo jinhone aaj ek bhi task nahi kiya (lastTaskCompletedAt is before today or null)
      const lazyUsers = await User.find({
        $or: [
          { lastTaskCompletedAt: { $lt: today } },
          { lastTaskCompletedAt: { $exists: false } },
          { lastTaskCompletedAt: null }
        ]
      });

      for (let user of lazyUsers) {
        user.currentStreak = 0; // Streak tod do
        user.missedYesterday = true; // Agle din saza dene ke liye flag ON
        await user.save();
      }

      console.log(`[SYSTEM] ⚔️ Punished ${lazyUsers.length} agents for missing tasks.`);
    } catch (error) {
      console.error('[SYSTEM ERROR] Watcher failed:', error);
    }
  });
};

module.exports = startMidnightWatcher;