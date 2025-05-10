#!/bin/bash
# Set required environment variables in Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production https://remrzuzzzsxmiumhfonq.supabase.co
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbXJ6dXp6enN4bWl1bWhmb25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDYxNjIsImV4cCI6MjA2MTk4MjE2Mn0.W8xPbiQ2nY-4txpGzWmMigjM18yqUvtTPebOeTWGkDw
vercel env add ENCRYPTION_KEY production production_key_min_32_chars_long_here
vercel env add SHIPPO_API_KEY production shippo_test_a646c6a24331882d85e232063d3a137bbbcb35ff
vercel env add NEXT_TELEMETRY_DISABLED production 1
vercel env add HOST_URL production https://novedlabels.vercel.app
vercel env add ENABLE_ANALYTICS production true
vercel env add ALLOWED_ORIGINS production https://novedlabels.vercel.app
echo "All environment variables have been added to Vercel"
