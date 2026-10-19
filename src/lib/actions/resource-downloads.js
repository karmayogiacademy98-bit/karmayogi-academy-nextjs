'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const downloadLeadSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  resource_id: z.string().min(1, 'Resource is required'),
  resource_title: z.string().optional(),
});

export async function submitResourceLead(prevState, formData) {
  const raw = {
    full_name: formData.get('full_name'),
    mobile: formData.get('mobile'),
    resource_id: formData.get('resource_id'),
    resource_title: formData.get('resource_title') || '',
  };

  const result = downloadLeadSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  // Save lead to resource_downloads table (or enquiries if that table doesn't exist)
  const { data, error } = await supabase.from('enquiries').insert({
    full_name: result.data.full_name,
    mobile: result.data.mobile,
    message: `Resource download: ${result.data.resource_title || result.data.resource_id}`,
    source: 'resource_download',
  }).select('id').single();

  if (error) {
    console.error('Resource lead insert error:', error);
    return {
      success: false,
      message: 'Failed to process your request. Please try again.',
    };
  }

  // Fetch the resource's file_url
  let fileUrl = null;
  try {
    const { data: resource } = await supabase
      .from('resources')
      .select('file_url')
      .eq('id', result.data.resource_id)
      .single();
    fileUrl = resource?.file_url || null;
  } catch {
    // Non-critical – we'll still report success
  }

  return {
    success: true,
    leadId: data?.id || null,
    fileUrl,
    message: 'Your download is ready!',
  };
}
