#!/bin/bash

# Start ngrok in the background
echo "🔗 Starting ngrok..."
ngrok http 3001 > /dev/null &

# Wait a moment to allow ngrok to boot
sleep 3

# Fetch the public URL from ngrok's API
NGROK_URL=$(curl --silent http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url')

# Echo the URL so you can copy-paste it
echo "✅ ngrok running at: $NGROK_URL"

# Set it to your .env.local if you want
echo "CALENDLY_WEBHOOK_URL=$NGROK_URL/api/calendly/webhook" > .env.ngrok

# Start Next.js dev server
echo "🚀 Starting Next.js server..."
npm run dev
