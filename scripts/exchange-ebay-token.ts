import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const refreshAccessToken = async () => {
  try {
    const credentials = Buffer.from(
      `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://api.ebay.com/identity/v1/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: process.env.EBAY_AUTHORIZATION_CODE || '',
        redirect_uri: process.env.EBAY_REDIRECT_URI || '',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    console.log('✅ New access token:', response.data.access_token);
    console.log('🔁 Refresh token:', response.data.refresh_token);
  } catch (error: any) {
    console.error('❌ Error occurred:', error.response?.data || error.message);
  }
};

refreshAccessToken();
