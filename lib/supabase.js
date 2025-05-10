'use client';

import { createClient } from '@supabase/supabase-js';

// Always use hardcoded values for development
const supabaseUrl = 'https://remrzuzzzsxmiumhfonq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbXJ6dXp6enN4bWl1bWhmb25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDYxNjIsImV4cCI6MjA2MTk4MjE2Mn0.W8xPbiQ2nY-4txpGzWmMigjM18yqUvtTPebOeTWGkDw';

let supabase;

if (typeof window !== 'undefined') {
  // Client-side initialization
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Server-side initialization
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export { supabase };

// Helper functions for common database operations

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserStats(userId) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getReferralStats(userId) {
  const { data, error } = await supabase
    .from('referral_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getRecentOrders(userId, limit = 5) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

export async function getRecentReferrals(userId, limit = 5) {
  const { data, error } = await supabase
    .from('referrals')
    .select(`
      *,
      referred_user:referred_user_id (
        email,
        full_name
      )
    `)
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

export async function getPartnerStatus(userId) {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createOrder(userId, orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ user_id: userId, ...orderData }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function createPartnerApplication(userId, applicationData) {
  const { data, error } = await supabase
    .from('partners')
    .insert([{ user_id: userId, ...applicationData }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function createReferral(referrerId, referredUserId) {
  const { data, error } = await supabase
    .from('referrals')
    .insert([{
      referrer_id: referrerId,
      referred_user_id: referredUserId,
      status: 'pending'
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateReferralStatus(referralId, status) {
  const { data, error } = await supabase
    .from('referrals')
    .update({ status })
    .eq('id', referralId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}