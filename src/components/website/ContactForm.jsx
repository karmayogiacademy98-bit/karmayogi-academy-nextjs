'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { verifyRecaptcha } from '@/lib/actions/verify-recaptcha';
import { submitEnquiry } from '@/lib/actions/enquiries';
import { trackGenerateLead } from '@/lib/analytics/data-layer';

const PHONE_REGEX = /^[6-9]\d{9}$/;

function validatePhone(value) {
  const digits = value.replace(/[\s\-()]/g, '');
  if (!digits) return 'Mobile number is required';
  if (!/^\d+$/.test(digits)) return 'Only digits are allowed';
  if (digits.length !== 10) return 'Must be exactly 10 digits';
  if (!PHONE_REGEX.test(digits)) return 'Must start with 6, 7, 8, or 9';
  return null;
}

export default function ContactForm({ courses = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    course: courses[0]?.title || 'MPSC Foundation Batch',
    courseId: courses[0]?.id || '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [errors, setErrors] = useState({});

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
    setFormData({ ...formData, mobile: value });
    if (errors.mobile) {
      const err = validatePhone(value);
      setErrors({ ...errors, mobile: err });
    }
  };

  const handleCourseChange = (e) => {
    const selectedTitle = e.target.value;
    const selectedCourse = courses.find(c => c.title === selectedTitle);
    setFormData({
      ...formData,
      course: selectedTitle,
      courseId: selectedCourse?.id || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side phone validation
    const phoneError = validatePhone(formData.mobile);
    if (phoneError) {
      setErrors({ ...errors, mobile: phoneError });
      return;
    }
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: 'Name is required' });
      return;
    }

    setErrors({});
    setSubmitting(true);

    if (!executeRecaptcha) {
      console.warn('Execute recaptcha not yet available');
      setSubmitting(false);
      return;
    }

    try {
      const token = await executeRecaptcha('contact_form');
      const verifyResult = await verifyRecaptcha(token);

      if (!verifyResult.success) {
        setSubmitting(false);
        alert(verifyResult.message || 'Bot activity detected.');
        return;
      }

      // Build FormData for the server action
      const fd = new FormData();
      fd.append('full_name', formData.name.trim());
      fd.append('mobile', formData.mobile.trim());
      fd.append('email', formData.email.trim());
      fd.append('course_id', formData.courseId);
      fd.append('course_name', formData.course);
      fd.append('message', formData.message.trim());

      const result = await submitEnquiry(null, fd);

      if (result.success && result.leadId) {
        trackGenerateLead({
          formName: 'contact_enquiry',
          course: formData.course,
          hasEmail: Boolean(formData.email),
        });
        setLeadId(result.leadId);
        setSubmitting(false);
        setSubmitted(true);
      } else {
        setSubmitting(false);
        if (result.errors) {
          setErrors(result.errors);
        } else {
          alert(result.message || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitting(false);
      alert('An error occurred during submission. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: '1.25rem',
          padding: '3rem 2rem',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
          textAlign: 'center'
        }}
      >
        <CheckCircle size={52} style={{ color: '#10B981', margin: '0 auto 1rem' }} />
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.5rem' }}>
          Enquiry Received!
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', maxWidth: '420px', margin: '0 auto 0.75rem', lineHeight: 1.6 }}>
          Thank you, <strong>{formData.name}</strong>. Our Nashik academic counselor will get in touch with you shortly at <strong>{formData.mobile}</strong>.
        </p>
        {leadId && (
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>
            Reference ID: {leadId.slice(0, 8).toUpperCase()}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setLeadId(null);
            setFormData({
              name: '',
              mobile: '',
              email: '',
              course: courses[0]?.title || 'MPSC Foundation Batch',
              courseId: courses[0]?.id || '',
              message: '',
            });
          }}
          style={{
            background: 'var(--orange)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '0.625rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '1.25rem',
        padding: '2.5rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: '#FEF3C7',
          color: '#92400E',
          fontSize: '0.6875rem',
          fontWeight: 700,
          padding: '0.2rem 0.6rem',
          borderRadius: '0.25rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem'
        }}
      >
        GET IN TOUCH
      </span>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.625rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.35rem' }}>
        Enquire for Admissions
      </h2>
      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        Fill out the form below and our Nashik counseling team will call you back.
      </p>

      <form
        onSubmit={handleSubmit}
        data-analytics-form="contact_enquiry"
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Anand Patil"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: null });
            }}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '0.5rem',
              border: errors.name ? '1px solid #EF4444' : '1px solid #D1D5DB',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          {errors.name && (
            <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <AlertCircle size={12} /> {errors.name}
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
              Mobile Number *
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
                placeholder="93255 89491"
                value={formData.mobile}
                onChange={handlePhoneChange}
                onBlur={() => {
                  const err = validatePhone(formData.mobile);
                  if (err) setErrors({ ...errors, mobile: err });
                }}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem 0.625rem 2.75rem',
                  borderRadius: '0.5rem',
                  border: errors.mobile ? '1px solid #EF4444' : '1px solid #D1D5DB',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
            {errors.mobile && (
              <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <AlertCircle size={12} /> {errors.mobile}
              </p>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: '0.5rem',
                border: '1px solid #D1D5DB',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
            Interested Course *
          </label>
          <select
            value={formData.course}
            onChange={handleCourseChange}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid #D1D5DB',
              fontSize: '0.875rem',
              background: 'white',
              outline: 'none'
            }}
          >
            {courses.length > 0 ? (
              courses.map((c) => (
                <option key={c.id || c.slug} value={c.title}>
                  {c.title}
                </option>
              ))
            ) : (
              <>
                <option value="MPSC Foundation Batch">MPSC Foundation Batch</option>
                <option value="ASO Exam Coaching">ASO Exam Coaching</option>
                <option value="Rajyaseva Classes in Nashik">Rajyaseva Classes in Nashik</option>
                <option value="PSI Classes in Nashik">PSI Classes in Nashik</option>
                <option value="MPSC Combine Group B & C">MPSC Combine Group B & C</option>
                <option value="Talathi Bharti Coaching">Talathi Bharti Coaching</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
            Message (Optional)
          </label>
          <textarea
            rows={4}
            placeholder="Ask about batch timings, fee structure, or demo classes..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid #D1D5DB',
              fontSize: '0.875rem',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
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
            gap: '0.5rem',
            boxShadow: '0 4px 10px rgba(244,90,10,0.25)',
            transition: 'background 0.15s'
          }}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={15} />
              Send Inquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
