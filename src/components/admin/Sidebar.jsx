"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Star,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Info,
  HardDrive,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/about", label: "About Page", icon: Info },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/faculty", label: "Faculty", icon: GraduationCap },
  { href: "/admin/results", label: "Results", icon: Award, exact: true },
  { href: "/admin/results/statistics", label: "Result Stats", icon: BarChart3 },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/resources", label: "Resources", icon: FileText },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/assets", label: "File Manager", icon: HardDrive },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const NavContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: "1.5rem 1.25rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "var(--orange)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChart3 size={20} color="white" />
          </div>
          <div>
            <div
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: "0.9375rem",
                lineHeight: 1,
              }}
            >
              Karmayogi
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "8px",
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  background: active ? "rgba(244,90,10,0.2)" : "transparent",
                  borderLeft: active
                    ? "3px solid var(--orange)"
                    : "3px solid transparent",
                  fontWeight: active ? 600 : 400,
                  fontSize: "0.875rem",
                  transition: "all 0.15s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  }
                }}
              >
                <Icon size={17} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "1rem 0.75rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {user && (
          <div style={{ padding: "0.625rem 0.875rem", marginBottom: "0.5rem" }}>
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.6875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.25rem",
              }}
            >
              Logged in as
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </div>
          </div>
        )}
        <form action={logout}>
          <button
            type="submit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.625rem 0.875rem",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.55)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
              e.currentTarget.style.color = "#fca5a5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.55)";
            }}
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: "none",
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 60,
          padding: "0.5rem",
          background: "var(--navy)",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
        }}
        id="sidebar-mobile-toggle"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            display: "none",
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
          id="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          minHeight: "100vh",
          background: "var(--navy)",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <NavContent />
      </aside>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-mobile-toggle { display: flex !important; }
          #sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}
