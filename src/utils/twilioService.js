const twilio = require('twilio');

// Initialize the Twilio client using .env variables
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWarningSMS = async (userPhoneNumber, userName) => {
  try {
    const message = await client.messages.create({
      body: `🚨 Aura Protocol: ${userName}, your focus time is up! Get back to work or your Aura Level will drop!`,
      from: process.env.TWILIO_PHONE_NUMBER, // Tumhara naya US Trial Number
      to: userPhoneNumber // Tumhara Verify kiya hua Indian number
    });
    
    console.log(`✅ SMS Sent Successfully! Message SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error(`❌ Twilio Error: ${error.message}`);
    return false;
  }
};

// --- NAYA FEATURE: VOICE CALL ---
const makeVoiceCall = async (userPhoneNumber, userName) => {
  try {
    const call = await client.calls.create({
      // TwiML: Yahan <Play> ke andar apna Cloudinary ka MP3 link daal do
      twiml: `<Response>
                <Play>https://res.cloudinary.com/dxnkrrh3f/video/upload/v1776678926/kyu-nahi-ho-rahi-padhai_kq9nel.mp3</Play> 
              </Response>`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: userPhoneNumber
    });

    console.log(`📞 Custom Voice Call Triggered! Call SID: ${call.sid}`);
    return true;
  } catch (error) {
    console.error(`❌ Twilio Voice Error: ${error.message}`);
    return false;
  }
};

module.exports = { sendWarningSMS, makeVoiceCall };