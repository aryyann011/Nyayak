import { supabase } from './supabase';

// 1. Fetch Profile (Read)
export const getProfile = async (userId) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};

// 2. Update Profile (Write)
// Merges new data into the JSONB column 'specific_data'
export const updateProfileData = async (userId, newSpecificData) => {
  if (!userId) return null;

  // First, get the current data to ensure we don't overwrite existing fields
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('specific_data')
    .eq('id', userId)
    .single();

  const currentData = currentProfile?.specific_data || {};

  // Merge old data with new data
  const updatedData = { ...currentData, ...newSpecificData };

  const { data, error } = await supabase
    .from('profiles')
    .update({ specific_data: updatedData })
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data;
};