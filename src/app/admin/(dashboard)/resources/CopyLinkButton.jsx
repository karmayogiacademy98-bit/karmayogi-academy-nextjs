'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CopyLinkButton({ slug }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/download/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Short download link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy short download link"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: copied ? '#166534' : '#15803d',
        background: copied ? '#dcfce7' : '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : `/download/${slug}`}
    </button>
  );
}
