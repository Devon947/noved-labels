import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://remrzuzzzsxmiumhfonq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbXJ6dXp6enN4bWl1bWhmb25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDYxNjIsImV4cCI6MjA2MTk4MjE2Mn0.W8xPbiQ2nY-4txpGzWmMigjM18yqUvtTPebOeTWGkDw';

// In development mode, we'll silently continue with mock functionality
const isDev = process.env.NODE_ENV !== 'production';

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Missing Supabase environment variables';
  if (!isDev) {
    throw new Error(errorMsg);
  } else {
    console.warn(`⚠️ ${errorMsg}. Using mock data for development.`);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations
export const getUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    if (isDev) {
      // Return mock user in development
      return { id: 'mock-user-id', email: 'dev@example.com', name: 'Dev User' };
    }
    return null;
  }
};

export const getUserStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user stats:', error);
    if (isDev) {
      // Return mock stats in development
      return { 
        user_id: userId, 
        labels_created: 10, 
        total_spent: 25.50,
        last_active: new Date().toISOString()
      };
    }
    throw error;
  }
};

export const getRecentOrders = async (userId, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting recent orders:', error);
    if (isDev) {
      // Return mock orders in development
      return Array(limit).fill(0).map((_, i) => ({
        id: `mock-order-${i}`,
        user_id: userId,
        status: 'completed',
        total: 5.99 + i,
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
        tracking_number: `TRK${100000 + i}`
      }));
    }
    return [];
  }
};

export const updateUserStats = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user stats:', error);
    if (isDev) {
      console.log('Mock update for user stats:', updates);
      return { success: true };
    }
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    if (isDev) {
      return { 
        id: `mock-order-${Date.now()}`, 
        ...orderData, 
        created_at: new Date().toISOString() 
      };
    }
    throw error;
  }
}; 