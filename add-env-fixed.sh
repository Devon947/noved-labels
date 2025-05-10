#!/bin/bash
# Set environment variables for all environments
vercel env add NEXT_PUBLIC_SUPABASE_URL -y https://remrzuzzzsxmiumhfonq.supabase.co
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY -y eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbXJ6dXp6enN4bWl1bWhmb25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDYxNjIsImV4cCI6MjA2MTk4MjE2Mn0.W8xPbiQ2nY-4txpGzWmMigjM18yqUvtTPebOeTWGkDw
vercel env add ENCRYPTION_KEY -y pR8zX2bN7vK5qW3sT9yF6dL4gH1jM3cV5xZ8bN2mQ7
vercel env add SHIPPO_API_KEY -y shippo_test_a646c6a24331882d85e232063d3a137bbbcb35ff
vercel env add NEXT_TELEMETRY_DISABLED -y 1
vercel env add HOST_URL -y https://novedlabels.vercel.app
vercel env add ENABLE_ANALYTICS -y true
vercel env add ALLOWED_ORIGINS -y https://novedlabels.vercel.app
echo "All environment variables have been added to Vercel"
