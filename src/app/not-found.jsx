import Link from 'next/link';
import { Home, ArrowLeft, BookOpen, Phone } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found | Karmayogi Academy Nashik',
  description: 'The page you are looking for does not exist. Browse our MPSC coaching courses or contact us.',
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B1B41 0%, #1E3A8A 50%, #0B1B41 100%)',
        padding: '2rem',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '560px',
          width: '100%',
        }}
      >
        {/* 404 Display */}
        <div
          style={{
            fontSize: 'clamp(6rem, 15vw, 10rem)',
            fontWeight: 900,
            fontFamily: 'Playfair Display, serif',
            background: 'linear-gradient(135deg, #F5B51B 0%, #F45A0A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            marginBottom: '1rem',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </div>

        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 800,
            color: 'white',
            marginBottom: '0.75rem',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: '420px',
            margin: '0 auto 2.5rem',
          }}
        >
          The page you&apos;re looking for has been moved, deleted, or never existed.
          Let&apos;s get you back on track.
        </p>

        {/* Navigation Links */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxWidth: '320px',
            margin: '0 auto 2rem',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#F45A0A',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9375rem',
              padding: '0.875rem 1.5rem',
              borderRadius: '0.625rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(244,90,10,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            <Home size={18} />
            Go to Homepage
          </Link>

          <Link
            href="/courses"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.625rem',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.15s',
            }}
          >
            <BookOpen size={16} />
            Browse Courses
          </Link>

          <Link
            href="/contact"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.625rem',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.15s',
            }}
          >
            <Phone size={16} />
            Contact Us
          </Link>
        </div>

        {/* Back link */}
        <button
          onClick={null}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          Or go back to the previous page
        </button>
      </div>
    </div>
  );
}
