'use client';

import { useState } from 'react';
import { FileText, Download, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { submitResourceLead } from '@/lib/actions/resource-downloads';

const PHONE_REGEX = /^[6-9]\d{9}$/;

function validatePhone(value) {
  const digits = value.replace(/[\s\-()]/g, '');
  if (!digits) return 'Mobile number is required';
  if (!/^\d+$/.test(digits)) return 'Only digits are allowed';
  if (digits.length !== 10) return 'Must be exactly 10 digits';
  if (!PHONE_REGEX.test(digits)) return 'Must start with 6, 7, 8, or 9';
  return null;
}

export default function ResourcesClient({ initialResources = [], categories = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '' });
  const [submitting, setSubmitting] = useState(false);
  const [downloadResult, setDownloadResult] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const filteredResources = activeCategory === 'all'
    ? initialResources
    : initialResources.filter((r) => r.category_slug === activeCategory || r.resource_categories?.slug === activeCategory);

  const handleOpenDownload = (resource) => {
    setSelectedResource(resource);
    setDownloadResult(null);
    setPhoneError(null);
    setFormData({ name: '', mobile: '' });
    setModalOpen(true);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
    setFormData({ ...formData, mobile: value });
    if (phoneError) {
      const err = validatePhone(value);
      setPhoneError(err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Client-side phone validation
    const pErr = validatePhone(formData.mobile);
    if (pErr) {
      setPhoneError(pErr);
      return;
    }
    setPhoneError(null);
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('full_name', formData.name.trim());
      fd.append('mobile', formData.mobile.trim());
      fd.append('resource_id', selectedResource?.id || '');
      fd.append('resource_title', selectedResource?.title || '');

      const result = await submitResourceLead(null, fd);

      if (result.success && result.leadId) {
        setDownloadResult(result);

        // Trigger the actual file download
        if (result.fileUrl) {
          const link = document.createElement('a');
          link.href = result.fileUrl;
          link.download = selectedResource?.title || 'resource';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        alert(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Resource download error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* FILTER PILLS */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '3rem' }}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: isActive ? 'none' : '1px solid #E5E7EB',
                background: isActive ? 'var(--orange)' : 'white',
                color: isActive ? 'white' : '#4B5563',
                boxShadow: isActive ? '0 2px 8px rgba(244,90,10,0.25)' : 'none'
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* RESOURCE CARDS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.75rem',
          marginBottom: '3rem'
        }}
      >
        {filteredResources.map((res, idx) => (
          <div
            key={res.id || idx}
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem'
            }}
          >
            <div>
              {/* Card Header: Icon & PDF Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '0.5rem',
                    background: '#FEF3C7',
                    color: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FileText size={22} />
                </div>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#2563EB',
                    background: '#EFF6FF',
                    border: '1px solid #DBEAFE',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '0.25rem',
                    letterSpacing: '0.04em'
                  }}
                >
                  {res.file_type || 'PDF'}
                </span>
              </div>

              <h3
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: 'var(--navy)',
                  lineHeight: 1.35,
                  marginBottom: '0.5rem'
                }}
              >
                {res.title}
              </h3>

              <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                Target Exam: <span style={{ color: '#374151', fontWeight: 500 }}>{res.target_exam || 'MPSC Aspirants'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenDownload(res)}
              style={{
                width: '100%',
                background: 'var(--orange)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.15s',
                boxShadow: '0 2px 6px rgba(244,90,10,0.2)'
              }}
            >
              <Download size={16} />
              Download Free
            </button>
          </div>
        ))}
      </div>

      {/* LEAD CAPTURE MODAL */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {!downloadResult ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: '#FEF3C7',
                      color: 'var(--orange)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <Download size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.25rem' }}>
                    Free Instant Download
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    {selectedResource?.title}
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      WhatsApp / Mobile Number *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontWeight: 500,
                      }}>
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.mobile}
                        onChange={handlePhoneChange}
                        onBlur={() => {
                          if (formData.mobile) {
                            const err = validatePhone(formData.mobile);
                            setPhoneError(err);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.875rem 0.625rem 2.75rem',
                          borderRadius: '0.5rem',
                          border: phoneError ? '1px solid #EF4444' : '1px solid #D1D5DB',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                    {phoneError && (
                      <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <AlertCircle size={12} /> {phoneError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      marginTop: '0.5rem',
                      background: 'var(--orange)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Preparing Download...
                      </>
                    ) : (
                      'Download PDF Now'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <CheckCircle size={48} style={{ color: '#10B981', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.5rem' }}>
                  {downloadResult.fileUrl ? 'Download Started!' : 'Enquiry Saved!'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                  {downloadResult.fileUrl
                    ? <>Thank you, <strong>{formData.name}</strong>. Your file download has started. If it didn&apos;t begin automatically, <a href={downloadResult.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)', fontWeight: 600 }}>click here to download</a>.</>
                    : <>Thank you, <strong>{formData.name}</strong>. This resource doesn&apos;t have a downloadable file yet. Our team will share it with you at <strong>{formData.mobile}</strong>.</>
                  }
                </p>
                {downloadResult.leadId && (
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>
                    Reference: {downloadResult.leadId.slice(0, 8).toUpperCase()}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: '#1F2937',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
