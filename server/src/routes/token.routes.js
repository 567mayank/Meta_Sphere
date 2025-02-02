import pkg from 'agora-access-token';
const { RtmTokenBuilder, RtmRole } = pkg;
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const generateToken = (uid) => {
  try {
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERT;
    
    if (!appID || !appCertificate) {
      throw new Error('AGORA_APP_ID and AGORA_APP_CERTIFICATE must be defined in environment variables');
    }

    const expirationTimeInSeconds = 3600 * 24; // 24 hours
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtmTokenBuilder.buildToken(
      appID,
      appCertificate,
      uid.toString(),
      RtmRole.Rtm_User,
      privilegeExpiredTs
    );

    return token;
  } catch (error) {
    throw error;
  }
};

router.post('/generate', async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const token = generateToken(uid);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Token Generation Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;