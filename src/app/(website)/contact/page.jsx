import PageHero from "@/components/website/PageHero";
import ContactForm from "@/components/website/ContactForm";
import { getSiteSettings } from "@/lib/queries/settings";
import { getCourses } from "@/lib/queries/courses";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Navigation,
} from "lucide-react";

export const metadata = {
  title: "Contact & Admissions | Karmayogi Academy Nashik",
  description:
    "Visit our Panchavati campus in Nashik or connect with our admission counseling team for batch admissions.",
};

export default async function ContactPage() {
  const [settings, courses] = await Promise.all([
    getSiteSettings(),
    getCourses(),
  ]);

  const googleMapsUrl =
    settings?.google_maps_url ||
    "https://maps.google.com/?q=Karmayogi+Academy+Nashik";

  return (
    <div style={{ backgroundColor: "#FAF9F6", minHeight: "100vh" }}>
      <PageHero
        breadcrumb="CONTACT US"
        title="Contact & Admissions"
        subtitle="Visit our Panchavati campus or connect with our admission desk."
      />

      <div className="container-ka" style={{ padding: "3.5rem 1rem" }}>
        {/* TWO COLUMN CONTACT SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            alignItems: "start",
            marginBottom: "4rem",
          }}
        >
          {/* Left Column: Form */}
          <ContactForm courses={courses} />

          {/* Right Column: Info Cards */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
          >
            {/* Card 1: Academy Contact Details */}
            <div
              style={{
                background: "white",
                borderRadius: "1.25rem",
                padding: "2rem",
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 14px rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--navy)",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                Academy Contact Details
              </h3>

              {/* Address */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                <MapPin
                  size={18}
                  style={{
                    color: "#EA580C",
                    flexShrink: 0,
                    marginTop: "0.2rem",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "var(--navy)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    Campus Address
                  </div>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#6B7280",
                      lineHeight: 1.6,
                    }}
                  >
                    {settings?.address ||
                      "Kasture Sadan, Ghankar Lane, beside Tulja Bhawani Mandir, near Panchavati Hotel, Vakil Wadi, Raviwar Karanja, Panchavati, Nashik, Maharashtra 422001"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                <Phone
                  size={18}
                  style={{
                    color: "#EA580C",
                    flexShrink: 0,
                    marginTop: "0.2rem",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "var(--navy)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    Phone Numbers
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.2rem",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <a
                      href={`tel:${settings?.phone?.replace(/\s/g, "") || "+919325589491"}`}
                      className="text-gray-600 hover:text-[var(--orange)]"
                    >
                      {settings?.phone || "+91 93255 89491"}
                    </a>
                    <a
                      href={`tel:${settings?.phone2?.replace(/\s/g, "") || "+918668578908"}`}
                      className="text-gray-600 hover:text-[var(--orange)]"
                    >
                      {settings?.phone2 || "+91 86685 78908"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                <Mail
                  size={18}
                  style={{
                    color: "#EA580C",
                    flexShrink: 0,
                    marginTop: "0.2rem",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "var(--navy)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    Email Address
                  </div>
                  <a
                    href={`mailto:${settings?.email || "info@karmayogiacademy.com"}`}
                    style={{ fontSize: "0.8125rem", color: "#6B7280" }}
                    className="hover:text-[var(--orange)]"
                  >
                    {settings?.email || "info@karmayogiacademy.com"}
                  </a>
                </div>
              </div>

              {/* Operating Hours Box */}
              <div
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FEF3C7",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                }}
              >
                <Clock
                  size={18}
                  style={{
                    color: "#D97706",
                    flexShrink: 0,
                    marginTop: "0.15rem",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "#92400E",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Operational Hours
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#78350F",
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

            {/* Card 2: Visiting Us in Person? */}
            <div
              style={{
                background: "#0B1B41",
                color: "white",
                borderRadius: "1.25rem",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0 4px 14px rgba(11, 27, 65, 0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "0.5rem",
                    background: "var(--orange)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <Navigation size={18} />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    Visiting Us in Person?
                  </h4>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Panchavati, Nashik Campus
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
                }}
              >
                Located right beside Tulja Bhawani Mandir near Panchavati Hotel.
                Tap below to navigate directly using Google Maps.
              </p>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: "var(--orange)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(244,90,10,0.3)",
                  transition: "opacity 0.15s",
                }}
              >
                <span>Get Directions on Google Maps</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: GOOGLE MAPS */}
        <div
          style={{
            background: "white",
            borderRadius: "1.25rem",
            padding: "2rem",
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 14px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: "var(--orange)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                FIND US ON GOOGLE MAPS
              </span>
              <h3
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.375rem",
                  fontWeight: 800,
                  color: "var(--navy)",
                  marginBottom: "0.25rem",
                }}
              >
                Karmayogi Academy Panchavati Campus
              </h3>
              <p style={{ fontSize: "0.8125rem", color: "#6B7280" }}>
                Kasture Sadan, Ghankar Lane, beside Tulja Bhawani Mandir, near
                Panchavati Hotel, Vakil Wadi, Raviwar Karanja, Panchavati,
                Nashik, Maharashtra 422001
              </p>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                background: "#1E3A8A",
                color: "white",
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                textDecoration: "none",
              }}
            >
              <span>Open in Maps App</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div
            style={{
              width: "100%",
              height: "420px",
              borderRadius: "0.75rem",
              overflow: "hidden",
              border: "1px solid #E5E7EB",
            }}
          >
            <iframe
              title="Karmayogi Academy Nashik Google Maps Location"
              src="https://maps.google.com/maps?q=Karmayogi+Academy+Nashik+Kasture+Sadan+Ghankar+Lane+Panchavati&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
