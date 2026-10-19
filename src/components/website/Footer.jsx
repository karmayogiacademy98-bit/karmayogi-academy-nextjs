import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { getSiteSettings } from "@/lib/queries/settings";
import Image from "next/image";

function Youtube({ size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon
        points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
        fill="currentColor"
      />
    </svg>
  );
}

function Instagram({ size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Facebook({ size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Karmayogi", href: "/about" },
  { label: "Post-Holder Faculty", href: "/faculty" },
  { label: "Results & Achievements", href: "/results" },
  { label: "Student Testimonials", href: "/results" },
  { label: "Exam Guidance Blog", href: "/blog" },
  { label: "Free Study Resources", href: "/resources" },
  { label: "Contact & Admissions", href: "/contact" },
  { label: "Sitemap", href: "/sitemap" },
];

const courseLinks = [
  { label: "MPSC Foundation Batch", href: "/courses/mpsc-foundation-batch" },
  { label: "ASO Exam Coaching", href: "/courses/aso-exam-coaching" },
  {
    label: "Rajyaseva Classes in Nashik",
    href: "/courses/rajyaseva-classes-in-nashik",
  },
  { label: "Saralseva Recruitment Coaching", href: "/courses/saralseva" },
  { label: "SR Exam Coaching", href: "/courses/sr-exam-coaching" },
  { label: "PSI Classes in Nashik", href: "/courses/psi-classes-in-nashik" },
  {
    label: "MPSC Combine Group B & C",
    href: "/courses/mpsc-combine-group-b-and-c",
  },
  { label: "Talathi Bharti Coaching", href: "/courses/talathi-bharti" },
];

export default async function Footer({ logoUrl }) {
  const settings = await getSiteSettings();

  return (
    <footer>
      {/* Main footer */}
      <div
        style={{
          background: "var(--navy)",
          color: "white",
          padding: "4rem 0 2rem",
        }}
      >
        <div className="container-ka">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "2.5rem",
              marginBottom: "3rem",
            }}
          >
            {/* Column 1: Academy Info */}
            <div>
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  marginBottom: "1rem",
                }}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Karmayogi Academy Logo"
                    width={46}
                    height={46}
                    style={{
                      borderRadius: 8,
                      objectFit: "contain",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      background: "var(--gold)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--navy)",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      fontFamily: "Playfair Display, serif",
                      flexShrink: 0,
                    }}
                  >
                    KY
                  </div>
                )}
                <div>
                  <div
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontWeight: 800,
                      fontSize: "1.0625rem",
                      color: "white",
                      lineHeight: 1.1,
                    }}
                  >
                    KARMAYOGI
                  </div>
                  <div
                    style={{
                      fontSize: "0.625rem",
                      fontWeight: 600,
                      color: "var(--gold)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    ACADEMY NASHIK
                  </div>
                </div>
              </Link>

              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--gold)",
                  fontStyle: "italic",
                  marginBottom: "0.75rem",
                  fontWeight: 500,
                }}
              >
                &ldquo;
                {settings?.hero_tagline ||
                  "Emerging as Officers, The Future is Unveiled"}
                &rdquo;
              </p>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.7,
                  marginBottom: "1.25rem",
                }}
              >
                {settings?.footer_description ||
                  "Maharashtra's Premier MPSC Coaching Institute in Nashik. Dedicated officer preparation with 52-week structured system."}
              </p>

              {/* Social icons */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                {settings?.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[var(--gold)] transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube size={20} />
                  </a>
                )}
                {settings?.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[var(--gold)] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {settings?.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[var(--gold)] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                )}
              </div>

              {/* Google Play */}
              {settings?.google_play_url && (
                <a
                  href={settings.google_play_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 0.875rem",
                    fontSize: "0.75rem",
                    color: "white",
                    fontWeight: 600,
                    transition: "background 0.2s",
                  }}
                >
                  <ExternalLink size={14} />
                  GET IT ON Google Play Store
                </a>
              )}
            </div>

            {/* Column 2: Quick Navigation */}
            <div>
              <h3
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--gold)",
                  marginBottom: "1.25rem",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Quick Navigation
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {quickLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      › {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: MPSC Courses */}
            <div>
              <h3
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--gold)",
                  marginBottom: "1.25rem",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                MPSC Courses (8)
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {courseLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      › {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Reach Our Academy */}
            <div>
              <h3
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--gold)",
                  marginBottom: "1.25rem",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Reach Our Academy
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <MapPin
                    size={16}
                    style={{
                      color: "var(--gold)",
                      flexShrink: 0,
                      marginTop: "0.125rem",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.6,
                    }}
                  >
                    {settings?.address ||
                      "Kasture Sadan, Ghankar Lane, beside Tulja Bhawani Mandir, near Panchavati Hotel, Vakil Wadi, Raviwar Karanje, Panchavati, Nashik, Maharashtra 422001"}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.375rem",
                  }}
                >
                  <a
                    href={`tel:${settings?.phone?.replace(/\s/g, "") || "+919325589491"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontSize: "0.8125rem",
                      color: "rgba(255,255,255,0.7)",
                      transition: "color 0.15s",
                    }}
                  >
                    <Phone size={14} style={{ color: "var(--gold)" }} />
                    {settings?.phone || "+91 93255 89491"}
                  </a>
                  <a
                    href={`tel:${settings?.phone2?.replace(/\s/g, "") || "+919325589491"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontSize: "0.8125rem",
                      color: "rgba(255,255,255,0.7)",
                      transition: "color 0.15s",
                    }}
                  >
                    <Phone size={14} style={{ color: "var(--gold)" }} />
                    {settings?.phone2 || "+91 86685 78908"}
                  </a>
                </div>
                <a
                  href={`mailto:${settings?.email || "info@karmayogiacademy.com"}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <Mail size={14} style={{ color: "var(--gold)" }} />
                  {settings?.email || "info@karmayogiacademy.com"}
                </a>
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.375rem",
                    }}
                  >
                    <Clock size={14} style={{ color: "var(--gold)" }} />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--gold)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Opening Hours
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.6,
                    }}
                  >
                    Monday–Saturday: 8:00 AM – 9:00 PM
                    <br />
                    Sunday: 10:00 AM – 2:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <p
              style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)" }}
            >
              © 2026 Karmayogi Academy Nashik. All Rights Reserved.
            </p>
            {/* <a href="https://magnobytes.in/">
              Made by Magnobytes Offwares Pvt. Ltd.
            </a> */}
            <p
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
              }}
            >
              Maharashtra&apos;s Officer Making Movement
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
