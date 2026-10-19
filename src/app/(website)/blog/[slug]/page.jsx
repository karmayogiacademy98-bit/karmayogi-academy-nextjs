import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import PageHero from "@/components/website/PageHero";
import Image from "next/image";
import { getBlogBySlug, getBlogs } from "@/lib/queries/blogs";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return { title: "Blog Post Not Found" };
  }
  return {
    title: blog.title,
    description:
      blog.excerpt ||
      "Read the latest MPSC guidance from Karmayogi Academy mentors.",
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = (await getBlogs({ limit: 3 }))
    .filter((b) => b.slug !== slug)
    .slice(0, 2);

  return (
    <div style={{ backgroundColor: "#FAF9F6", minHeight: "100vh" }}>
      <PageHero
        breadcrumb="BLOG ARTICLE"
        title={blog.title}
        subtitle={blog.excerpt}
      />

      <div
        className="container-ka"
        style={{ padding: "3.5rem 1rem", maxWidth: "840px", margin: "0 auto" }}
      >
        {/* Back Link */}
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--orange)",
            fontSize: "0.875rem",
            fontWeight: 600,
            marginBottom: "2rem",
          }}
          className="hover:underline"
        >
          <ArrowLeft size={16} />
          Back to all articles
        </Link>

        {/* Featured Image */}
        {blog.featured_image ? (
          <div
            style={{
              marginBottom: "2.5rem",
              borderRadius: "1.25rem",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              position: "relative",
              width: "100%",
              height: "400px",
            }}
          >
            <Image
              src={blog.featured_image}
              alt={blog.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        ) : (
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.75rem",
              marginBottom: "1rem",
              height: "400px",
            }}
          >
            <span
              style={{
                fontSize: "2.5rem",
                fontFamily: "Playfair Display, serif",
                color: "var(--gold)",
                fontWeight: 800,
                opacity: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              KY
            </span>
          </div>
        )}

        {/* Article Meta Bar */}
        <div
          style={{
            background: "white",
            borderRadius: "0.75rem",
            padding: "1rem 1.5rem",
            border: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2.5rem",
            fontSize: "0.8125rem",
            color: "#6B7280",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
          >
            <Calendar size={14} style={{ color: "var(--orange)" }} />
            <span>
              {blog.date ||
                (blog.published_at
                  ? new Date(blog.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent")}
            </span>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
          >
            <User size={14} style={{ color: "var(--orange)" }} />
            <span>{blog.author || "Karmayogi Academy Mentors"}</span>
          </div>

          {(blog.category || blog.blog_categories?.name) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                marginLeft: "auto",
              }}
            >
              <Tag size={14} style={{ color: "var(--orange)" }} />
              <span style={{ fontWeight: 600, color: "var(--navy)" }}>
                {blog.category || blog.blog_categories?.name}
              </span>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div
          style={{
            background: "white",
            borderRadius: "1.25rem",
            padding: "clamp(1.5rem, 5vw, 3rem)",
            border: "1px solid #E5E7EB",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            lineHeight: 1.8,
            color: "#374151",
            fontSize: "1.125rem",
            marginBottom: "4rem",
          }}
          className="prose-ka max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div>
            <h3
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--navy)",
                marginBottom: "1.5rem",
              }}
            >
              Related Guidance Articles
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {relatedBlogs.map((item) => (
                <div
                  key={item.slug}
                  style={{
                    background: "white",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--navy)",
                        marginBottom: "0.5rem",
                        lineHeight: 1.4,
                      }}
                    >
                      <Link
                        href={`/blog/${item.slug}`}
                        className="hover:text-[var(--orange)] transition-colors"
                      >
                        {item.title}
                      </Link>
                    </h4>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "#6B7280",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${item.slug}`}
                    style={{
                      marginTop: "1rem",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "var(--orange)",
                    }}
                    className="hover:underline"
                  >
                    Read Article →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
