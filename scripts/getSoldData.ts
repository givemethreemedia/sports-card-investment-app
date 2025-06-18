import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const getSoldData = async () => {
  try {
    const credentials = Buffer.from(
      `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://api.ebay.com/identity/v1/oauth2/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.EBAY_REFRESH_TOKEN || '',
        scope: 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/buy.browse',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    const accessToken = response.data.access_token;
    console.log('✅ Access token acquired. Proceeding with sold item fetch...');

    // TODO: Use `accessToken` to fetch sold listings
  } catch (error: any) {
    console.error('❌ Error occurred:', error.response?.data || error.message);
  }
};

getSoldData();
