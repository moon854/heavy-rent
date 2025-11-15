# SMS OTP Integration Guide

## Current Status
⚠️ **OTP is currently NOT being sent via SMS** - it's only stored in Firestore for testing.

## Why SMS is Not Working
The current implementation only:
1. Generates OTP code
2. Stores it in Firestore
3. Logs it to console (for testing)

**No actual SMS service is integrated yet.**

## How to Integrate SMS Service

### Option 1: Backend API (Recommended - Most Secure)

#### Step 1: Create Backend API Endpoint
Create a backend API (Node.js/Express, Python/Flask, etc.) that sends SMS:

```javascript
// Example: Backend API endpoint (Node.js/Express)
app.post('/api/send-otp', async (req, res) => {
  const { phone, otp } = req.body;
  
  // Use Twilio or other SMS service
  const twilio = require('twilio');
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
  try {
    await client.messages.create({
      body: `Your OTP code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Step 2: Update firebaseHelper.js
Uncomment and configure the backend API call in `sendPhoneOTP` function.

### Option 2: Twilio Direct Integration (Less Secure - Not Recommended for Production)

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Install: `npm install twilio`
4. Add Twilio credentials to your app
5. Uncomment Twilio code in `sendPhoneOTP` function

**⚠️ Warning:** Don't expose Twilio credentials in frontend code. Use backend API instead.

### Option 3: Firebase Cloud Functions (Recommended)

1. Create a Cloud Function that sends SMS
2. Call it from the app
3. Keeps credentials secure on server

### Option 4: AWS SNS
If you're using AWS, integrate AWS SNS for SMS sending.

## For Pakistan Specifically

Recommended SMS services for Pakistan:
1. **Twilio** - International, supports Pakistan
2. **Telenor SMS API** - Local Pakistani service
3. **Jazz SMS API** - Local Pakistani service
4. **Ufone SMS Gateway** - Local Pakistani service

## Testing
Currently, OTP is logged to console. Check your development console to see the OTP code for testing.

## Next Steps
1. Choose an SMS service
2. Set up backend API or Cloud Function
3. Update `sendPhoneOTP` function in `firebaseHelper.js`
4. Test with real phone numbers
5. Remove console.log statements

