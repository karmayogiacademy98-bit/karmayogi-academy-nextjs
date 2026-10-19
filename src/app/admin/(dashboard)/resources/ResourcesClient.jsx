'use client';

import { useState, useTransition } from 'react';
import { createResource } from '@/lib/actions/admin-resources';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

function toSlug(str) {
  return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function ResourcesClient({ categories }) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const publishedEl = e.target.querySelector('[name="is_published"][type="checkbox"]');
    formData.set('is_published', publishedEl?.checked ? 'true' : 'false');
    if (!formData.get('slug')) formData.set('slug', toSlug(title));

    startTransition(async () => {
      const result = await createResource(null, formData);
      if (result?.success) {
        toast.success(result.message);
        setShowForm(false);
        setTitle('');
        router.refresh();
      } else {
        toast.error(result?.message || 'Error');
      }
    });
  };

  return (
    <>
      <button onClick={() => setShowForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: 'var(--orange)', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
        <Plus size={16} /> Add Resource
      </button>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.25rem' }}>Add Resource</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" name="title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Rajyaseva History Notes" />
              </div>
              <div>
                <label className="form-label">URL Slug</label>
                <input className="form-input" name="slug" value={toSlug(title)} onChange={() => {}} placeholder="auto-generated" style={{ fontFamily: 'monospace' }} readOnly />
                <p style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '0.35rem' }}>
                  Branded download link: <strong>/download/{toSlug(title) || 'resource-slug'}</strong>
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select name="category_id" className="form-input">
                    <option value="">No category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Target Exam</label>
                  <input className="form-input" name="target_exam" placeholder="e.g. Rajyaseva" />
                </div>
              </div>
              <div>
                <label className="form-label">File URL (PDF link) *</label>
                <input className="form-input" name="file_url" required placeholder="https://storage.supabase.co/..." />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input" name="description" rows={2} placeholder="Brief description..." style={{ resize: 'vertical' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                <input type="checkbox" name="is_published" defaultChecked style={{ accentColor: 'var(--blue)' }} /> Publish immediately
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={isPending} style={{ flex: 1, padding: '0.75rem', background: 'var(--orange)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: isPending ? 'not-allowed' : 'pointer' }}>
                  {isPending ? 'Saving…' : 'Add Resource'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1.5px solid var(--gray-200)', borderRadius: '8px', color: 'var(--gray-600)', fontWeight: 500, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
