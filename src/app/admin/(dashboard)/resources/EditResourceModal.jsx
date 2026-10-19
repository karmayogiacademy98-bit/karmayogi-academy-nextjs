'use client';

import { useState, useTransition } from 'react';
import { updateResource } from '@/lib/actions/admin-resources';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Pencil, X } from 'lucide-react';

function toSlug(str) {
  return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function EditResourceModal({ resource, categories = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(resource.title || '');
  const [slug, setSlug] = useState(resource.slug || '');
  const [autoSlug, setAutoSlug] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setTitle(resource.title || '');
    setSlug(resource.slug || '');
    setAutoSlug(false);
    setIsOpen(true);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (autoSlug) {
      setSlug(toSlug(val));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const publishedEl = e.target.querySelector('[name="is_published"][type="checkbox"]');
    formData.set('is_published', publishedEl?.checked ? 'true' : 'false');
    formData.set('slug', slug || toSlug(title));

    startTransition(async () => {
      const result = await updateResource(resource.id, null, formData);
      if (result?.success) {
        toast.success(result.message || 'Resource updated successfully!');
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(result?.message || 'Failed to update resource');
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        title="Edit resource"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px',
          borderRadius: '6px',
          background: '#eff6ff',
          color: '#1d4ed8',
          border: '1px solid #bfdbfe',
          cursor: 'pointer',
        }}
      >
        <Pencil size={14} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              width: '100%',
              maxWidth: 520,
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--gray-500)',
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.25rem' }}>
              Edit Resource
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  name="title"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Rajyaseva History Notes"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>URL Slug *</label>
                  <label style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={autoSlug}
                      onChange={(e) => {
                        setAutoSlug(e.target.checked);
                        if (e.target.checked) setSlug(toSlug(title));
                      }}
                      style={{ accentColor: 'var(--blue)' }}
                    />
                    Auto-generate from title
                  </label>
                </div>
                <input
                  className="form-input"
                  name="slug"
                  required
                  value={slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="e.g. rajyaseva-history-notes"
                  style={{ fontFamily: 'monospace', marginTop: '0.25rem' }}
                />
                <p style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '0.35rem' }}>
                  Short link preview: <strong>/download/{slug || 'slug'}</strong>
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select name="category_id" defaultValue={resource.category_id || ''} className="form-input">
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Target Exam</label>
                  <input
                    className="form-input"
                    name="target_exam"
                    defaultValue={resource.target_exam || ''}
                    placeholder="e.g. Rajyaseva, PSI"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">File URL (PDF link) *</label>
                <input
                  className="form-input"
                  name="file_url"
                  required
                  defaultValue={resource.file_url || ''}
                  placeholder="https://storage.supabase.co/... or /assets/..."
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  name="description"
                  rows={2}
                  defaultValue={resource.description || ''}
                  placeholder="Brief description of the resource..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={Boolean(resource.is_published)}
                  style={{ accentColor: 'var(--blue)' }}
                />
                Published (visible on website)
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--orange)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 600,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isPending ? 'Saving changes…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: 'transparent',
                    border: '1.5px solid var(--gray-200)',
                    borderRadius: '8px',
                    color: 'var(--gray-600)',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
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
