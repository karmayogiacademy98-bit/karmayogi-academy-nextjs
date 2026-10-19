import { getCourses } from '@/lib/queries/courses';
import { getBlogs } from '@/lib/queries/blogs';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://karmayogiacademy.com';

  // Static pages
  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/faculty`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/results`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ];

  // Dynamic course pages
  let coursePages = [];
  try {
    const courses = await getCourses();
    coursePages = courses.map((course) => ({
      url: `${siteUrl}/courses/${course.slug}`,
      lastModified: course.updated_at ? new Date(course.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  } catch {
    // Silently handle – static pages will still be returned
  }

  // Dynamic blog pages
  let blogPages = [];
  try {
    const blogs = await getBlogs({});
    blogPages = blogs.map((blog) => ({
      url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  } catch {
    // Silently handle
  }

  return [...staticPages, ...coursePages, ...blogPages];
}
