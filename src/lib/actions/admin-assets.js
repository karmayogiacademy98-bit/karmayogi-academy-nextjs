'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const BUCKET = 'assets';

/**
 * List all files in a given folder path (default: root).
 * Returns an array of file objects augmented with publicUrl.
 */
export async function listAssets(folder = '') {
  const supabase = await createClient();
  const prefix = folder ? folder.replace(/\/$/, '') : '';
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix || undefined, {
    limit: 500,
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) return { success: false, message: error.message, files: [] };

  const files = (data || []).map((item) => {
    const filePath = prefix ? `${prefix}/${item.name}` : item.name;
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return {
      ...item,
      path: filePath,
      folder: prefix,
      publicUrl: urlData?.publicUrl ?? null,
      isFolder: item.id === null,
    };
  });

  return { success: true, files };
}

/**
 * Upload one or more files to the given folder.
 * Expects a FormData with `files` (FileList) and `folder` (string).
 */
export async function uploadAssets(prevState, formData) {
  const supabase = await createClient();
  const folder = (formData.get('folder') || '').replace(/^\/|\/$/g, '');
  const files = formData.getAll('files');

  if (!files || files.length === 0) {
    return { success: false, message: 'No files selected.' };
  }

  const errors = [];
  const uploaded = [];

  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = folder ? `${folder}/${safeName}` : safeName;

    const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'application/octet-stream',
    });

    if (error) {
      errors.push(`${file.name}: ${error.message}`);
    } else {
      uploaded.push(filePath);
    }
  }

  revalidatePath('/admin/assets');

  if (errors.length > 0) {
    return { success: uploaded.length > 0, message: errors.join('; '), uploaded };
  }

  return { success: true, message: `${uploaded.length} file(s) uploaded successfully.`, uploaded };
}

/**
 * Delete a single file by its storage path.
 */
export async function deleteAsset(filePath) {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/assets');
  return { success: true, message: 'File deleted.' };
}

/**
 * Delete multiple files.
 */
export async function deleteAssets(filePaths) {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove(filePaths);
  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/assets');
  return { success: true, message: `${filePaths.length} file(s) deleted.` };
}

/**
 * Create a new folder using a .keep placeholder file.
 */
export async function createFolder(prevState, formData) {
  const supabase = await createClient();
  const parentFolder = (formData.get('parentFolder') || '').replace(/^\/|\/$/g, '');
  const folderName = (formData.get('folderName') || '').trim().replace(/[^a-zA-Z0-9._-]/g, '_');

  if (!folderName) return { success: false, message: 'Folder name is required.' };

  const keepPath = parentFolder ? `${parentFolder}/${folderName}/.keep` : `${folderName}/.keep`;
  const emptyFile = new Blob([''], { type: 'text/plain' });

  const { error } = await supabase.storage.from(BUCKET).upload(keepPath, emptyFile, {
    upsert: false,
  });

  if (error && !error.message.includes('already exists')) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/assets');
  return { success: true, message: `Folder "${folderName}" created.` };
}

/**
 * Ensure the assets bucket exists (creates it if not).
 */
export async function ensureAssetsBucket() {
  const supabase = await createClient();
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = (buckets || []).some((b) => b.name === BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Bucket created.' };
  }
  return { success: true, message: 'Bucket already exists.' };
}
