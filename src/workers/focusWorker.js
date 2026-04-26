const { Worker } = require('bullmq');
const { connection } = require('../config/queue');
const FocusSession = require('../models/FocusSession');
const User = require('../models/user.model');
const { sendWarningSMS, makeVoiceCall } = require('../utils/twilioService');

const focusWorker = new Worker('FocusQueue', async (job) => {
  try {
    const session = await FocusSession.findById(job.data.sessionId).populate('user');
    
    if (session && session.status === 'ACTIVE') {
      session.status = 'ESCALATED_CALL';
      await session.save();

      const user = session.user;
      const myVerifiedNumber = "+916387768943"; // <--- APNA NUMBER DAALO

      // 1. Pehle SMS bhejo
      await sendWarningSMS(myVerifiedNumber, user.name);
      
      // 2. Turant baad Call lagao
      await makeVoiceCall(myVerifiedNumber, user.name);

      console.log(`🚨 Escalation Full Protocol Executed for ${user.name}`);
    }
  } catch (error) {
    console.error(`Worker Error: ${error.message}`);
  }
}, { connection });

// Worker fail hone par error dikhane ke liye
focusWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

module.exports = focusWorker;