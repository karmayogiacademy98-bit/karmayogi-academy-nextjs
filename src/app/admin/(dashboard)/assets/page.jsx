import { listAssets, ensureAssetsBucket } from '@/lib/actions/admin-assets';
import FileManagerClient from './FileManagerClient';

export const metadata = { title: 'File Manager' };

export default async function AssetsPage({ searchParams }) {
  await ensureAssetsBucket();
  const params = await searchParams;
  const folder = params?.folder || '';
  const { files = [], success, message } = await listAssets(folder);

  return (
    <FileManagerClient
      initialFiles={files}
      currentFolder={folder}
      fetchError={!success ? message : null}
    />
  );
}
