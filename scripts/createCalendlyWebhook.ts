// scripts/createCalendlyWebhook.ts
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // If using Node 18 or below

// ✅ Load env vars from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// ✅ Extract required variables
const {
  CALENDLY_PERSONAL_TOKEN,
  CALENDLY_WEBHOOK_URL,
  CALENDLY_ORGANIZATION_URI,
} = process.env;

// ✅ Check env vars
if (!CALENDLY_PERSONAL_TOKEN || !CALENDLY_WEBHOOK_URL || !CALENDLY_ORGANIZATION_URI) {
  console.error('❌ Missing required env vars:', {
    CALENDLY_PERSONAL_TOKEN,
    CALENDLY_WEBHOOK_URL,
    CALENDLY_ORGANIZATION_URI,
  });
  process.exit(1);
}

async function createWebhook() {
  console.log('🌐 Creating Calendly webhook...');

  try {
    const res = await fetch('https://api.calendly.com/webhook_subscriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CALENDLY_PERSONAL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: CALENDLY_WEBHOOK_URL,
        events: ['invitee.created'],
        organization: CALENDLY_ORGANIZATION_URI,
        scope: 'organization',
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`❌ Calendly API Error (${res.status}):`, data);
    } else {
      console.log('📬 Webhook creation response:', data);
    }
  } catch (error) {
    console.error('❌ Failed to create Calendly webhook:', error);
  }
}

createWebhook();
