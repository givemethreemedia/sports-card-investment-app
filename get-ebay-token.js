// get-ebay-token.js

const fetch = require('node-fetch');
const qs = require('querystring');

const clientId = 'ZachElls-SportsCa-PRD-2f03bd6ca-219ec27d';
const clientSecret = 'PRD-f03bd6ca5741-d3e3-4d11-8c78-450e';
const redirectUri = 'Zach_Ellsworth-ZachElls-Sports-ykhhvtjv';

const authorizationCode = 'v^1.1#i^1#f^0#I^3#p^3#r^1#t^Ul41XzEwOjUwN0Y2MjQzOEU0MDlBOTRFOUZFREU0RDU0RTI5NDUzXzFfMSNFXjI2MA==';

const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

async function getToken() {
  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basicAuth}`
    },
    body: qs.stringify({
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: redirectUri
    })
  });

  const data = await response.json();
  if (response.ok) {
    console.log('✅ Access Token:', data.access_token);
    console.log('🔁 Refresh Token:', data.refresh_token);
  } else {
    console.error('❌ Error:', data);
  }
}

getToken();
