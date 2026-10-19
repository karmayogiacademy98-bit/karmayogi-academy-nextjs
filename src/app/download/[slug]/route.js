import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.redirect(new URL('/resources', request.url));
  }

  const supabase = await createClient();

  const { data: resource, error } = await supabase
    .from('resources')
    .select('id, title, slug, file_url, download_count, is_published')
    .eq('slug', slug)
    .single();

  if (error || !resource || !resource.is_published || !resource.file_url) {
    return NextResponse.redirect(new URL('/resources', request.url));
  }

  // Increment download count
  try {
    await supabase
      .from('resources')
      .update({ download_count: (resource.download_count || 0) + 1 })
      .eq('id', resource.id);
  } catch (err) {
    console.error('Failed to increment download count:', err);
  }

  // Redirect to the actual file URL
  return NextResponse.redirect(resource.file_url, { status: 302 });
}
