'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSiteSettings(prevState, formData) {
  const supabase = await createClient();

  const fields = [
    'academy_name', 'phone', 'phone2', 'whatsapp', 'email', 'address',
    'google_maps_url', 'google_maps_embed', 'facebook_url', 'instagram_url',
    'youtube_url', 'google_play_url', 'opening_hours', 'footer_description',
    'hero_tagline', 'hero_subtitle', 'logo_url',
  ];

  const updates = {};
  for (const field of fields) {
    const val = formData.get(field);
    if (val !== null) updates[field] = val;
  }

  // Handle nested homepage_config
  const homepageConfigStr = formData.get('homepage_config');
  if (homepageConfigStr) {
    try {
      updates.homepage_config = JSON.parse(homepageConfigStr);
    } catch (e) {
      console.error('Failed to parse homepage_config', e);
    }
  }

  // Get the existing row id
  const { data: existing } = await supabase.from('site_settings').select('id').single();
  if (!existing) {
    return { success: false, message: 'Settings row not found. Please seed the database.' };
  }

  const { error } = await supabase
    .from('site_settings')
    .update(updates)
    .eq('id', existing.id);

  if (error) {
    console.error('Settings update error:', error);
    return { success: false, message: 'Failed to update settings.' };
  }

  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true, message: 'Settings updated successfully.' };
}
