import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Enroll Now | Karmayogi Academy Nashik',
  description: 'Enroll for MPSC coaching at Karmayogi Academy Nashik. Admissions open for 2026-27 batches.',
};

export default function EnrollPage() {
  redirect('/contact');
}
