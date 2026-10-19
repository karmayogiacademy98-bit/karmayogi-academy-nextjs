"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";

export default function SettingsClient({ initialSettings, onSubmit }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const homepageConfig = {
      hero_label: formData.get("hc_hero_label"),
      hero_image: formData.get("hc_hero_image"),
      hero_trust_indicators: formData.get("hc_hero_trust_indicators"),
      about_label: formData.get("hc_about_label"),
      about_heading: formData.get("hc_about_heading"),
      about_text: formData.get("hc_about_text"),
    };
    formData.set("homepage_config", JSON.stringify(homepageConfig));
    [
      "hc_hero_label",
      "hc_hero_image",
      "hc_hero_trust_indicators",
      "hc_about_label",
      "hc_about_heading",
      "hc_about_text",
    ].forEach((key) => formData.delete(key));

    startTransition(async () => {
      const result = await onSubmit(null, formData);
      if (result?.success) toast.success(result.message);
      else toast.error(result?.message || "Error saving settings");
    });
  };

  const sectionStyle = {
    background: "white",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };
  const sectionTitleStyle = {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "var(--navy)",
    marginBottom: "1.25rem",
  };
  const inputStyle = {
    width: "100%",
    padding: "0.625rem 0.875rem",
    border: "1.5px solid var(--gray-200)",
    borderRadius: "0.375rem",
    fontSize: "0.9375rem",
    color: "var(--gray-800)",
    outline: "none",
  };

  if (!initialSettings) {
    return (
      <div style={sectionStyle}>
        No settings found. Please run the database seed script.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <div>
          {/* General */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>General Information</h2>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <div>
                <label className="form-label">Academy Name</label>
                <input
                  className="form-input"
                  name="academy_name"
                  defaultValue={initialSettings.academy_name}
                />
              </div>
              <div>
                <label className="form-label">Logo URL</label>
                <input
                  className="form-input"
                  name="logo_url"
                  defaultValue={initialSettings.logo_url || ""}
                />
              </div>
              <div>
                <label className="form-label">Footer Description</label>
                <textarea
                  className="form-input"
                  name="footer_description"
                  rows={3}
                  defaultValue={initialSettings.footer_description}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Contact Information</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.25rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  className="form-input"
                  name="phone"
                  defaultValue={initialSettings.phone}
                />
              </div>
              <div>
                <label className="form-label">Phone Number 2</label>
                <input
                  className="form-input"
                  name="phone2"
                  defaultValue={initialSettings.phone2}
                />
              </div>
              <div>
                <label className="form-label">
                  WhatsApp Number (include country code, no +)
                </label>
                <input
                  className="form-input"
                  name="whatsapp"
                  defaultValue={initialSettings.whatsapp}
                  placeholder="e.g. 919876543210"
                />
              </div>
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                name="email"
                defaultValue={initialSettings.email}
              />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="form-label">Physical Address</label>
              <textarea
                className="form-input"
                name="address"
                rows={2}
                defaultValue={initialSettings.address}
                style={{ resize: "vertical" }}
              />
            </div>
            <div>
              <label className="form-label">Opening Hours</label>
              <input
                className="form-input"
                name="opening_hours"
                defaultValue={initialSettings.opening_hours}
              />
            </div>
          </div>

          {/* Homepage Content */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Homepage Config</h2>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <div>
                <label className="form-label">Hero Label</label>
                <input
                  className="form-input"
                  name="hc_hero_label"
                  defaultValue={
                    initialSettings.homepage_config?.hero_label ||
                    "Welcome to Karmayogi Academy"
                  }
                />
              </div>
              <div>
                <label className="form-label">Hero Tagline</label>
                <input
                  className="form-input"
                  name="hero_tagline"
                  defaultValue={initialSettings.hero_tagline}
                />
              </div>
              <div>
                <label className="form-label">Hero Subtitle</label>
                <textarea
                  className="form-input"
                  name="hero_subtitle"
                  rows={3}
                  defaultValue={initialSettings.hero_subtitle}
                  style={{ resize: "vertical" }}
                />
              </div>
              <div>
                <label className="form-label">Hero Background Image URL</label>
                <input
                  className="form-input"
                  name="hc_hero_image"
                  defaultValue={
                    initialSettings.homepage_config?.hero_image ||
                    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
                  }
                />
              </div>
              <div>
                <label className="form-label">
                  Hero Trust Indicators (comma separated)
                </label>
                <input
                  className="form-input"
                  name="hc_hero_trust_indicators"
                  defaultValue={
                    initialSettings.homepage_config?.hero_trust_indicators ||
                    "Post-Holder Faculty, 52-Week System, Personal Mentorship"
                  }
                />
              </div>

              <hr style={{ margin: "1rem 0", borderColor: "var(--border)" }} />

              <div>
                <label className="form-label">About Label</label>
                <input
                  className="form-input"
                  name="hc_about_label"
                  defaultValue={
                    initialSettings.homepage_config?.about_label ||
                    "About Karmayogi Academy"
                  }
                />
              </div>
              <div>
                <label className="form-label">About Heading</label>
                <input
                  className="form-input"
                  name="hc_about_heading"
                  defaultValue={
                    initialSettings.homepage_config?.about_heading ||
                    "Maharashtra's Premier MPSC Coaching Institute"
                  }
                />
              </div>
              <div>
                <label className="form-label">About Text</label>
                <textarea
                  className="form-input"
                  name="hc_about_text"
                  rows={4}
                  defaultValue={
                    initialSettings.homepage_config?.about_text ||
                    "Founded with a vision to create honest, dedicated, and competent officers for Maharashtra, Karmayogi Academy stands apart through its unique approach to competitive exam preparation."
                  }
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          style={{
            position: "sticky",
            top: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "1.25rem",
            }}
          >
            <button
              type="submit"
              disabled={isPending}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: isPending ? "rgba(244,90,10,0.5)" : "var(--orange)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: 600,
                fontSize: "0.9375rem",
                cursor: isPending ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(244,90,10,0.2)",
              }}
            >
              {isPending ? "Saving Settings…" : "Save Settings"}
            </button>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--gray-500)",
                textAlign: "center",
                marginTop: "0.75rem",
              }}
            >
              Last updated:{" "}
              {new Date(initialSettings.updated_at).toLocaleString()}
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "1.25rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--navy)",
                marginBottom: "1rem",
              }}
            >
              Social Links
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="form-label">Facebook URL</label>
                <input
                  className="form-input"
                  name="facebook_url"
                  defaultValue={initialSettings.facebook_url}
                />
              </div>
              <div>
                <label className="form-label">Instagram URL</label>
                <input
                  className="form-input"
                  name="instagram_url"
                  defaultValue={initialSettings.instagram_url}
                />
              </div>
              <div>
                <label className="form-label">YouTube URL</label>
                <input
                  className="form-input"
                  name="youtube_url"
                  defaultValue={initialSettings.youtube_url}
                />
              </div>
              <div>
                <label className="form-label">Google Play App URL</label>
                <input
                  className="form-input"
                  name="google_play_url"
                  defaultValue={initialSettings.google_play_url}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              padding: "1.25rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--navy)",
                marginBottom: "1rem",
              }}
            >
              Maps
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="form-label">Google Maps Link</label>
                <input
                  className="form-input"
                  name="google_maps_url"
                  defaultValue={initialSettings.google_maps_url}
                />
              </div>
              <div>
                <label className="form-label">Google Maps Embed HTML</label>
                <textarea
                  className="form-input"
                  name="google_maps_embed"
                  rows={3}
                  defaultValue={initialSettings.google_maps_embed || ""}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
