import { createClient } from '@/lib/supabase/server';
import { toggleResourcePublish, deleteResource } from '@/lib/actions/admin-resources';
import { Eye, EyeOff, Trash2, FileText, ExternalLink } from 'lucide-react';
import ResourcesClient from './ResourcesClient';
import CopyLinkButton from './CopyLinkButton';
import EditResourceModal from './EditResourceModal';

export const metadata = { title: 'Resources' };

export default async function ResourcesAdminPage() {
  const supabase = await createClient();
  const [{ data: resources }, { data: categories }] = await Promise.all([
    supabase.from('resources').select('*, resource_categories(name)').order('created_at', { ascending: false }),
    supabase.from('resource_categories').select('*').order('display_order'),
  ]);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', fontFamily: 'Playfair Display, serif' }}>Resources</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>PDF downloads & study materials</p>
        </div>
        <ResourcesClient categories={categories || []} />
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--light-bg)' }}>
                {['Title', 'Category', 'Target Exam', 'Downloads', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(resources || []).map((r, i) => (
                <tr key={r.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} color="var(--orange)" />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.9375rem' }}>{r.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px', flexWrap: 'wrap' }}>
                          {r.slug && <CopyLinkButton slug={r.slug} />}
                          {r.file_url && (
                            <a href={r.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              Original <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{r.resource_categories?.name || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{r.target_exam || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 600 }}>{r.download_count}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <form action={async () => { 'use server'; await toggleResourcePublish(r.id, r.is_published); }}>
                      <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.2rem 0.625rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', background: r.is_published ? '#dcfce7' : '#f3f4f6', color: r.is_published ? '#166534' : '#6b7280', fontSize: '0.75rem', fontWeight: 600 }}>
                        {r.is_published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Hidden</>}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <EditResourceModal resource={r} categories={categories || []} />
                      <form action={async () => { 'use server'; await deleteResource(r.id); }}>
                        <button type="submit" style={{ display: 'flex', alignItems: 'center', padding: '6px', borderRadius: '6px', background: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer' }} title="Delete resource">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!resources || resources.length === 0) && (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-400)' }}>No resources yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
