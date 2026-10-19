'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const enquirySchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  course_id: z.string().uuid().optional().or(z.literal('')),
  course_name: z.string().optional(),
  preferred_batch: z.string().optional(),
  message: z.string().optional()
});







export async function submitEnquiry(
prevState,
formData)
{
  const raw = {
    full_name: formData.get('full_name'),
    mobile: formData.get('mobile'),
    email: formData.get('email') || undefined,
    course_id: formData.get('course_id') || undefined,
    course_name: formData.get('course_name') || undefined,
    preferred_batch: formData.get('preferred_batch') || undefined,
    message: formData.get('message') || undefined
  };

  const result = enquirySchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: result.error.flatten().fieldErrors
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('enquiries').insert({
    full_name: result.data.full_name,
    mobile: result.data.mobile,
    email: result.data.email || null,
    course_id: result.data.course_id || null,
    course_name: result.data.course_name || null,
    preferred_batch: result.data.preferred_batch || null,
    message: result.data.message || null
  }).select('id').single();

  if (error) {
    console.error('Enquiry insert error:', error);
    return {
      success: false,
      message: 'Failed to submit enquiry. Please try again.'
    };
  }

  revalidatePath('/admin/enquiries');
  return {
    success: true,
    leadId: data?.id || null,
    message: 'Thank you! Our team will contact you shortly.'
  };
}