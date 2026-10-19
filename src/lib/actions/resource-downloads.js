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
  const leadId = crypto.randomUUID();

  // Save lead to enquiries table
  const { error } = await supabase.from('enquiries').insert({
    id: leadId,
    full_name: result.data.full_name,
    mobile: result.data.mobile,
    course_name: result.data.resource_title ? `Resource: ${result.data.resource_title}` : 'Resource Download',
    message: `Resource download: ${result.data.resource_title || result.data.resource_id}`,
  });

  if (error) {
    console.error('Resource lead insert error:', error);
    return {
      success: false,
      message: 'Failed to process your request. Please try again.',
    };
  }

  // Fetch the resource's file_url and increment download_count
  let fileUrl = null;
  try {
    const { data: resource } = await supabase
      .from('resources')
      .select('slug, file_url, download_count')
      .eq('id', result.data.resource_id)
      .single();

    // Prefer clean shortened branded URL
    fileUrl = resource?.slug ? `/download/${resource.slug}` : (resource?.file_url || null);

    if (resource) {
      await supabase
        .from('resources')
        .update({ download_count: (resource.download_count || 0) + 1 })
        .eq('id', result.data.resource_id);
    }
  } catch {
    // Non-critical – we'll still report success
  }

  return {
    success: true,
    leadId,
    fileUrl,
    message: 'Your download is ready!',
  };
}
