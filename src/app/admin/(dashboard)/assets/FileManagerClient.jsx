"use client";

import { useState, useRef, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FolderOpen, Folder, Image, FileText, Film, Music, File,
  Upload, Trash2, Copy, FolderPlus, ChevronRight, Search,
  X, Check, AlertCircle, Grid3X3, List, Download, Link2,
} from "lucide-react";
import { uploadAssets, deleteAssets, createFolder } from "@/lib/actions/admin-assets";

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getFileIcon(name, isFolder) {
  if (isFolder) return Folder;
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg","jpeg","png","gif","webp","svg","avif"].includes(ext)) return Image;
  if (["mp4","webm","mov","avi"].includes(ext)) return Film;
  if (["mp3","wav","ogg","flac"].includes(ext)) return Music;
  if (["pdf","doc","docx","xls","xlsx","ppt","pptx"].includes(ext)) return FileText;
  return File;
}

function isImageFile(name) {
  const ext = name.split(".").pop()?.toLowerCase();
  return ["jpg","jpeg","png","gif","webp","svg","avif"].includes(ext);
}

function buildBreadcrumbs(folder) {
  if (!folder) return [];
  const parts = folder.split("/").filter(Boolean);
  return parts.map((part, i) => ({ label: part, path: parts.slice(0, i + 1).join("/") }));
}

// ─── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 999,
      background: isError ? "#fef2f2" : "#f0fdf4",
      border: `1px solid ${isError ? "#fca5a5" : "#86efac"}`,
      borderRadius: "10px", padding: "0.875rem 1.25rem",
      display: "flex", alignItems: "center", gap: "0.625rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)", maxWidth: 380,
      animation: "slideUp 0.25s ease",
    }}>
      {isError ? <AlertCircle size={18} color="#dc2626" /> : <Check size={18} color="#16a34a" />}
      <span style={{ fontSize: "0.875rem", color: isError ? "#dc2626" : "#15803d", fontWeight: 500, flex: 1 }}>
        {toast.message}
      </span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
        <X size={14} color={isError ? "#dc2626" : "#16a34a"} />
      </button>
    </div>
  );
}

// ─── File Card (Grid) ────────────────────────────────────────────────────────────

function FileCard({ file, selected, onSelect, onOpen, onCopyUrl }) {
  const Icon = getFileIcon(file.name, file.isFolder);
  const img = !file.isFolder && isImageFile(file.name);
  if (file.name === ".keep") return null;

  return (
    <div
      onClick={() => onSelect(file.path)}
      onDoubleClick={() => file.isFolder && onOpen(file.path)}
      style={{
        background: selected ? "rgba(244,90,10,0.06)" : "white",
        border: `1.5px solid ${selected ? "var(--orange)" : "var(--border)"}`,
        borderRadius: "10px", padding: "1rem", cursor: "pointer",
        transition: "all 0.15s ease", display: "flex", flexDirection: "column",
        alignItems: "center", gap: "0.625rem", position: "relative", userSelect: "none",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = "rgba(244,90,10,0.4)"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      {selected && (
        <div style={{
          position: "absolute", top: 8, right: 8, width: 18, height: 18,
          background: "var(--orange)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={11} color="white" />
        </div>
      )}

      {img && file.publicUrl ? (
        <img src={file.publicUrl} alt={file.name}
          style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: "6px", background: "#f4f5f7" }}
          onError={e => { e.target.style.display = "none"; }}
        />
      ) : (
        <div style={{
          width: 56, height: 56, borderRadius: "10px",
          background: file.isFolder ? "rgba(244,90,10,0.1)" : "#f4f5f7",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={28} color={file.isFolder ? "var(--orange)" : "#6b7280"}
            fill={file.isFolder ? "rgba(244,90,10,0.15)" : "none"} />
        </div>
      )}

      <div style={{
        fontSize: "0.75rem", color: "var(--navy)", fontWeight: 500,
        textAlign: "center", width: "100%",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }} title={file.name}>{file.name}</div>

      {!file.isFolder && (
        <div style={{ fontSize: "0.6875rem", color: "var(--gray-500)" }}>
          {formatBytes(file.metadata?.size)}
        </div>
      )}

      {!file.isFolder && file.publicUrl && (
        <button
          onClick={e => { e.stopPropagation(); onCopyUrl(file.publicUrl); }}
          title="Copy URL"
          style={{
            position: "absolute", bottom: 8, right: 8,
            background: "white", border: "1px solid var(--border)",
            borderRadius: "6px", padding: "3px 6px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 3,
            fontSize: "0.6875rem", color: "var(--gray-600)",
          }}
        >
          <Link2 size={10} /> URL
        </button>
      )}
    </div>
  );
}

// ─── File Row (List) ─────────────────────────────────────────────────────────────

function FileRow({ file, selected, onSelect, onOpen, onCopyUrl }) {
  const Icon = getFileIcon(file.name, file.isFolder);
  if (file.name === ".keep") return null;

  return (
    <tr
      onClick={() => onSelect(file.path)}
      onDoubleClick={() => file.isFolder && onOpen(file.path)}
      style={{
        background: selected ? "rgba(244,90,10,0.04)" : "white",
        cursor: "pointer", borderBottom: "1px solid var(--border)",
        transition: "background 0.1s ease",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "#f9fafb"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "white"; }}
    >
      <td style={{ padding: "0.625rem 1rem", width: 36 }}>
        <input type="checkbox" checked={selected}
          onChange={() => onSelect(file.path)}
          onClick={e => e.stopPropagation()}
          style={{ accentColor: "var(--orange)" }}
        />
      </td>
      <td style={{ padding: "0.625rem 0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <Icon size={18} color={file.isFolder ? "var(--orange)" : "#6b7280"}
            fill={file.isFolder ? "rgba(244,90,10,0.15)" : "none"} />
          <span style={{ fontSize: "0.875rem", color: "var(--navy)", fontWeight: file.isFolder ? 600 : 400 }}>
            {file.name}
          </span>
        </div>
      </td>
      <td style={{ padding: "0.625rem 1rem", fontSize: "0.8125rem", color: "var(--gray-500)", whiteSpace: "nowrap" }}>
        {file.isFolder ? "Folder" : (file.metadata?.mimetype || "—")}
      </td>
      <td style={{ padding: "0.625rem 1rem", fontSize: "0.8125rem", color: "var(--gray-500)", whiteSpace: "nowrap" }}>
        {file.isFolder ? "—" : formatBytes(file.metadata?.size)}
      </td>
      <td style={{ padding: "0.625rem 1rem", fontSize: "0.8125rem", color: "var(--gray-500)", whiteSpace: "nowrap" }}>
        {formatDate(file.created_at)}
      </td>
      <td style={{ padding: "0.625rem 1rem" }}>
        {!file.isFolder && file.publicUrl && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={e => { e.stopPropagation(); onCopyUrl(file.publicUrl); }}
              style={{
                background: "none", border: "1px solid var(--border)", borderRadius: "6px",
                padding: "3px 8px", cursor: "pointer", fontSize: "0.75rem", color: "var(--gray-600)",
                display: "flex", alignItems: "center", gap: 3,
              }}
            >
              <Link2 size={11} /> URL
            </button>
            <a href={file.publicUrl} download onClick={e => e.stopPropagation()}
              style={{
                background: "none", border: "1px solid var(--border)", borderRadius: "6px",
                padding: "3px 8px", cursor: "pointer", fontSize: "0.75rem", color: "var(--gray-600)",
                display: "flex", alignItems: "center", gap: 3, textDecoration: "none",
              }}
            >
              <Download size={11} />
            </a>
          </div>
        )}
      </td>
    </tr>
  );
}

// ─── Upload Zone ─────────────────────────────────────────────────────────────────

function UploadZone({ currentFolder, onUploadDone }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef(null);

  const handleFiles = useCallback((fileList) => {
    if (!fileList || fileList.length === 0) return;
    const fd = new FormData();
    fd.append("folder", currentFolder);
    Array.from(fileList).forEach(f => fd.append("files", f));
    startTransition(async () => {
      const result = await uploadAssets(null, fd);
      onUploadDone(result);
    });
  }, [currentFolder, onUploadDone]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragging ? "var(--orange)" : "var(--border)"}`,
        borderRadius: "12px", padding: "2rem 1rem", textAlign: "center", cursor: "pointer",
        background: isDragging ? "rgba(244,90,10,0.04)" : "#fafafa", transition: "all 0.2s ease",
      }}
    >
      <input ref={inputRef} type="file" multiple style={{ display: "none" }}
        onChange={e => handleFiles(e.target.files)} />
      {isPending ? (
        <div style={{ color: "var(--orange)", fontSize: "0.9375rem", fontWeight: 600 }}>Uploading…</div>
      ) : (
        <>
          <Upload size={28} color={isDragging ? "var(--orange)" : "#9ca3af"} />
          <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: isDragging ? "var(--orange)" : "var(--gray-500)", fontWeight: 500 }}>
            Drop files here or <span style={{ color: "var(--orange)" }}>browse</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>
            Images, PDFs, videos and more
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────

export default function FileManagerClient({ initialFiles, currentFolder, fetchError }) {
  const router = useRouter();
  const [files, setFiles] = useState(initialFiles);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [toast, setToast] = useState(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const breadcrumbs = buildBreadcrumbs(currentFolder);

  const navigateTo = (folder) => {
    const url = folder ? `/admin/assets?folder=${encodeURIComponent(folder)}` : "/admin/assets";
    setSelected(new Set());
    setSearch("");
    router.push(url);
  };

  const toggleSelect = (path) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const filteredFiles = files.filter(f => f.name !== ".keep" && f.name.toLowerCase().includes(search.toLowerCase()));
  const folders = filteredFiles.filter(f => f.isFolder);
  const fileItems = filteredFiles.filter(f => !f.isFolder);

  const selectAll = () => {
    if (selected.size === fileItems.length && fileItems.length > 0) setSelected(new Set());
    else setSelected(new Set(fileItems.map(f => f.path)));
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} file(s)? This cannot be undone.`)) return;
    setIsDeleting(true);
    const result = await deleteAssets(Array.from(selected));
    setIsDeleting(false);
    if (result.success) {
      setFiles(prev => prev.filter(f => !selected.has(f.path)));
      setSelected(new Set());
      showToast(result.message);
    } else {
      showToast(result.message, "error");
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => showToast("URL copied to clipboard!"));
  };

  const handleCreateFolder = () => {
    if (!folderName.trim()) return;
    const fd = new FormData();
    fd.append("parentFolder", currentFolder);
    fd.append("folderName", folderName.trim());
    startTransition(async () => {
      const result = await createFolder(null, fd);
      if (result.success) {
        setShowNewFolder(false);
        setFolderName("");
        showToast(result.message);
        router.refresh();
      } else {
        showToast(result.message, "error");
      }
    });
  };

  const handleUploadDone = (result) => {
    if (result.success) {
      showToast(result.message);
      router.refresh();
    } else {
      showToast(result.message, "error");
    }
  };

  const selPath = selected.size === 1 ? Array.from(selected)[0] : null;
  const selFile = selPath ? files.find(f => f.path === selPath) : null;

  return (
    <>
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div style={{ padding: "2rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--navy)", fontFamily: "Playfair Display, serif", marginBottom: "0.25rem" }}>
              File Manager
            </h1>
            <p style={{ color: "var(--gray-500)", fontSize: "0.9375rem" }}>Manage all assets stored in Supabase Storage.</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button onClick={() => setShowNewFolder(v => !v)} style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid var(--border)", background: "white", color: "var(--navy)", fontWeight: 500, fontSize: "0.875rem", cursor: "pointer" }}>
              <FolderPlus size={15} /> New Folder
            </button>
            {selected.size > 0 && (
              <button onClick={handleDelete} disabled={isDeleting} style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
                <Trash2 size={15} /> Delete ({selected.size})
              </button>
            )}
          </div>
        </div>

        {/* New Folder Input */}
        {showNewFolder && (
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <FolderPlus size={18} color="var(--orange)" />
            <input autoFocus type="text" placeholder="Folder name…" value={folderName}
              onChange={e => setFolderName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreateFolder()}
              style={{ flex: 1, border: "1px solid var(--border)", borderRadius: "6px", padding: "0.4rem 0.75rem", fontSize: "0.875rem", outline: "none" }}
            />
            <button onClick={handleCreateFolder} disabled={isPending} style={{ padding: "0.4rem 1rem", borderRadius: "6px", border: "none", background: "var(--orange)", color: "white", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
              Create
            </button>
            <button onClick={() => { setShowNewFolder(false); setFolderName(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-500)" }}>
              <X size={16} />
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem", alignItems: "start" }}>
          {/* File Browser */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
            {/* Toolbar */}
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1, flexWrap: "wrap" }}>
                <button onClick={() => navigateTo("")} style={{ background: "none", border: "none", cursor: "pointer", color: currentFolder ? "var(--blue)" : "var(--navy)", fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem", padding: 0 }}>
                  <FolderOpen size={15} /> Assets
                </button>
                {breadcrumbs.map(crumb => (
                  <span key={crumb.path} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <ChevronRight size={13} color="#9ca3af" />
                    <button onClick={() => navigateTo(crumb.path)} style={{ background: "none", border: "none", cursor: "pointer", color: crumb.path === currentFolder ? "var(--navy)" : "var(--blue)", fontWeight: crumb.path === currentFolder ? 700 : 500, fontSize: "0.875rem", padding: 0 }}>
                      {crumb.label}
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ position: "relative" }}>
                <Search size={14} color="#9ca3af" style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }} />
                <input type="text" placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: "1.75rem", paddingRight: "0.75rem", paddingTop: "0.375rem", paddingBottom: "0.375rem", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "0.8125rem", outline: "none", width: 160 }}
                />
              </div>
              <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                {[{ mode: "grid", Icon: Grid3X3 }, { mode: "list", Icon: List }].map(({ mode, Icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: "0.375rem 0.625rem", background: viewMode === mode ? "var(--orange)" : "white", color: viewMode === mode ? "white" : "var(--gray-500)", border: "none", cursor: "pointer" }}>
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {fetchError && (
              <div style={{ padding: "1rem 1.25rem", color: "#dc2626", fontSize: "0.875rem" }}>⚠️ {fetchError}</div>
            )}

            {/* Content */}
            <div style={{ padding: "1rem 1.25rem" }}>
              {filteredFiles.length === 0 ? (
                <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--gray-400)", fontSize: "0.9375rem" }}>
                  <FolderOpen size={40} color="#d1d5db" style={{ marginBottom: "0.75rem" }} />
                  <div>{search ? "No files match your search." : "This folder is empty."}</div>
                </div>
              ) : viewMode === "grid" ? (
                <>
                  {folders.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Folders</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem" }}>
                        {folders.map(f => <FileCard key={f.path} file={f} selected={selected.has(f.path)} onSelect={toggleSelect} onOpen={navigateTo} onCopyUrl={handleCopyUrl} />)}
                      </div>
                    </div>
                  )}
                  {fileItems.length > 0 && (
                    <div>
                      <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        Files
                        <button onClick={selectAll} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.6875rem", color: "var(--blue)", fontWeight: 600, textTransform: "none" }}>
                          {selected.size === fileItems.length && fileItems.length > 0 ? "Deselect all" : "Select all"}
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem" }}>
                        {fileItems.map(f => <FileCard key={f.path} file={f} selected={selected.has(f.path)} onSelect={toggleSelect} onOpen={navigateTo} onCopyUrl={handleCopyUrl} />)}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--light-bg)" }}>
                        <th style={{ padding: "0.5rem 1rem", width: 36 }}>
                          <input type="checkbox" onChange={selectAll} checked={selected.size === fileItems.length && fileItems.length > 0} style={{ accentColor: "var(--orange)" }} />
                        </th>
                        {["Name","Type","Size","Created","Actions"].map(h => (
                          <th key={h} style={{ padding: "0.5rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "var(--gray-600)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map(f => <FileRow key={f.path} file={f} selected={selected.has(f.path)} onSelect={toggleSelect} onOpen={navigateTo} onCopyUrl={handleCopyUrl} />)}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{ padding: "0.625rem 1.25rem", borderTop: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--gray-500)", display: "flex", justifyContent: "space-between" }}>
              <span>{folders.length} folder{folders.length !== 1 ? "s" : ""}, {fileItems.length} file{fileItems.length !== 1 ? "s" : ""}</span>
              {selected.size > 0 && <span style={{ color: "var(--orange)", fontWeight: 600 }}>{selected.size} selected</span>}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Upload */}
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "var(--shadow)", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Upload size={15} color="var(--orange)" /> Upload Files
                {currentFolder && (
                  <span style={{ fontSize: "0.6875rem", background: "rgba(244,90,10,0.1)", color: "var(--orange)", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>
                    → {currentFolder.split("/").pop()}
                  </span>
                )}
              </div>
              <UploadZone currentFolder={currentFolder} onUploadDone={handleUploadDone} />
            </div>

            {/* Selected file info */}
            {selFile && !selFile.isFolder && (
              <div style={{ background: "white", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
                {isImageFile(selFile.name) && selFile.publicUrl && (
                  <img src={selFile.publicUrl} alt={selFile.name} style={{ width: "100%", maxHeight: 160, objectFit: "cover" }} />
                )}
                <div style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--navy)", marginBottom: "0.5rem", wordBreak: "break-all" }}>{selFile.name}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.8125rem", color: "var(--gray-500)" }}>
                    <span>Size: {formatBytes(selFile.metadata?.size)}</span>
                    <span>Type: {selFile.metadata?.mimetype || "—"}</span>
                    <span>Added: {formatDate(selFile.created_at)}</span>
                  </div>
                  {selFile.publicUrl && (
                    <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{ background: "#f4f5f7", borderRadius: "6px", padding: "0.375rem 0.625rem", fontSize: "0.6875rem", color: "var(--gray-600)", wordBreak: "break-all", fontFamily: "monospace" }}>
                        {selFile.publicUrl}
                      </div>
                      <button onClick={() => handleCopyUrl(selFile.publicUrl)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border)", background: "white", color: "var(--navy)", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}>
                        <Copy size={13} /> Copy Public URL
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tips */}
            <div style={{ background: "rgba(244,90,10,0.04)", borderRadius: "10px", border: "1px solid rgba(244,90,10,0.15)", padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "var(--gray-600)", lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "0.25rem" }}>💡 Tips</div>
              <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                <li>Double-click a folder to open it</li>
                <li>Drag &amp; drop to upload files</li>
                <li>Click files to select, then delete</li>
                <li>Copy public URLs to use in content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
