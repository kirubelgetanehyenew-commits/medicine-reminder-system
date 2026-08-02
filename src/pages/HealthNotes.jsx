import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { notesAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  FaPlus, FaTrash, FaEdit, FaSave, FaTimes,
  FaThumbtack, FaSearch, FaStickyNote,
} from "react-icons/fa";

const MOODS = [
  { value: "great",    emoji: "😄", label: "Great"    },
  { value: "good",     emoji: "🙂", label: "Good"     },
  { value: "okay",     emoji: "😐", label: "Okay"     },
  { value: "bad",      emoji: "😕", label: "Bad"      },
  { value: "terrible", emoji: "😞", label: "Terrible" },
];

const TAGS = ["General", "Symptoms", "Side Effects", "Diet", "Exercise", "Doctor Visit", "Medication"];

const MOOD_COLORS = {
  great:    { bg: "rgba(22,163,74,0.08)",   border: "rgba(22,163,74,0.2)",   text: "var(--green)" },
  good:     { bg: "rgba(37,99,235,0.08)",   border: "rgba(37,99,235,0.2)",   text: "var(--blue)"  },
  okay:     { bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)", text: "var(--text-muted)" },
  bad:      { bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.2)",   text: "var(--amber)" },
  terrible: { bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.2)",   text: "var(--red)"   },
};

const emptyForm = { title: "", content: "", mood: "okay", tags: [] };

function HealthNotes() {
  const [notes,     setNotes]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(emptyForm);
  const [saving,    setSaving]    = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [search,    setSearch]    = useState("");
  const [moodFilter,setMoodFilter]= useState("all");

  // Load notes
  const load = async () => {
    try {
      const data = await notesAPI.getAll();
      setNotes(data);
    } catch { toast.error("Failed to load notes."); }
    finally  { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Filter
  const filtered = notes
    .filter(n => moodFilter === "all" || n.mood === moodFilter)
    .filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned - a.pinned;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const handleTagToggle = (tag) => {
    setForm(p => ({
      ...p,
      tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        const updated = await notesAPI.update(editId, form);
        setNotes(p => p.map(n => n.id === editId ? updated : n));
        toast.success("Note updated.");
      } else {
        const created = await notesAPI.create(form);
        setNotes(p => [created, ...p]);
        toast.success("Note saved.");
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);
    } catch { toast.error("Failed to save note."); }
    finally  { setSaving(false); }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content, mood: note.mood, tags: note.tags || [] });
    setEditId(note.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await notesAPI.remove(id);
      setNotes(p => p.filter(n => n.id !== id));
      toast.success("Note deleted.");
    } catch { toast.error("Failed to delete."); }
  };

  const handlePin = async (id) => {
    try {
      const updated = await notesAPI.pin(id);
      setNotes(p => p.map(n => n.id === id ? updated : n));
    } catch { toast.error("Failed to pin."); }
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const lbl = {
    fontSize: "0.73rem", fontWeight: 600, textTransform: "uppercase",
    letterSpacing: "0.06em", color: "var(--text-muted)", display: "block", marginBottom: 6,
  };

  return (
    <AppLayout>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.03em", margin: 0 }}>
            Health Notes
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.88rem" }}>
            Journal your health, symptoms, side effects, and doctor visits.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) cancelForm(); }}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 18px", borderRadius: "var(--r-md)",
            background: showForm ? "var(--bg-subtle)" : "var(--blue)",
            border: showForm ? "1px solid var(--border)" : "none",
            color: showForm ? "var(--text-muted)" : "white",
            fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
            fontFamily: "inherit", boxShadow: showForm ? "none" : "0 2px 8px rgba(37,99,235,0.3)",
            transition: "all 0.15s",
          }}
        >
          {showForm ? <><FaTimes size={12} /> Cancel</> : <><FaPlus size={12} /> New Note</>}
        </button>
      </div>

      {/* ── Compose / Edit Form ── */}
      {showForm && (
        <div
          className="glass"
          style={{ padding: "28px", marginBottom: 24, borderLeft: "3px solid var(--blue)" }}
        >
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-heading)", margin: "0 0 20px" }}>
            {editId ? "✏️ Edit Note" : "📝 New Note"}
          </p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Title */}
            <div>
              <label style={lbl}>Title</label>
              <input
                type="text"
                placeholder="e.g. Feeling dizzy after morning dose"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="modern-input"
              />
            </div>

            {/* Content */}
            <div>
              <label style={lbl}>Content</label>
              <textarea
                rows={5}
                placeholder="Write your health observation, symptoms, or notes here…"
                value={form.content}
                onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                className="modern-input"
                style={{ resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
              />
            </div>

            {/* Mood */}
            <div>
              <label style={lbl}>How are you feeling?</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {MOODS.map(({ value, emoji, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, mood: value }))}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 14px", borderRadius: "var(--r-full)",
                      border: `1.5px solid ${form.mood === value ? MOOD_COLORS[value].border : "var(--border)"}`,
                      background: form.mood === value ? MOOD_COLORS[value].bg : "transparent",
                      color: form.mood === value ? MOOD_COLORS[value].text : "var(--text-muted)",
                      fontWeight: form.mood === value ? 700 : 500,
                      fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={lbl}>Tags</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    style={{
                      padding: "5px 12px", borderRadius: "var(--r-full)",
                      border: `1px solid ${form.tags.includes(tag) ? "var(--blue-light)" : "var(--border)"}`,
                      background: form.tags.includes(tag) ? "var(--blue-muted)" : "transparent",
                      color: form.tags.includes(tag) ? "var(--blue)" : "var(--text-muted)",
                      fontSize: "0.78rem", fontWeight: form.tags.includes(tag) ? 600 : 400,
                      cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "10px 22px", borderRadius: "var(--r-md)",
                  background: "var(--blue)", border: "none", color: "white",
                  fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                  fontFamily: "inherit", opacity: saving ? 0.7 : 1,
                  boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                }}
              >
                <FaSave size={12} /> {saving ? "Saving…" : editId ? "Update Note" : "Save Note"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                style={{
                  padding: "10px 18px", borderRadius: "var(--r-md)",
                  border: "1px solid var(--border)", background: "transparent",
                  color: "var(--text-muted)", fontWeight: 500, fontSize: "0.9rem",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Stats strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Total Notes",  value: notes.length,                                      bg: "var(--bg-surface)",   border: "var(--border)" },
          { label: "Pinned",       value: notes.filter(n => n.pinned).length,                bg: "var(--amber-bg)",     border: "var(--amber-border)", vc: "var(--amber)" },
          { label: "This Month",   value: notes.filter(n => new Date(n.createdAt).getMonth() === new Date().getMonth()).length, bg: "var(--blue-muted)", border: "var(--blue-light)", vc: "var(--blue)" },
        ].map(({ label, value, bg, border, vc }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--r-md)", padding: "14px 16px", boxShadow: "var(--shadow-xs)" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 4px" }}>{label}</p>
            <p style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: vc || "var(--text-heading)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + mood filter ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <FaSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none", fontSize: "0.8rem" }} />
          <input
            type="text"
            placeholder="Search notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="modern-input"
            style={{ paddingLeft: 36 }}
          />
        </div>
        <select
          value={moodFilter}
          onChange={e => setMoodFilter(e.target.value)}
          className="modern-input"
          style={{ width: "auto", minWidth: 140 }}
        >
          <option value="all">All moods</option>
          {MOODS.map(m => <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>)}
        </select>
      </div>

      {/* ── Notes grid ── */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div
          className="glass"
          style={{ textAlign: "center", padding: "60px 24px" }}
        >
          <FaStickyNote size={36} style={{ color: "var(--text-subtle)", marginBottom: 14 }} />
          <p style={{ fontWeight: 600, color: "var(--text-heading)", margin: "0 0 6px" }}>No notes yet</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 18px" }}>
            Click "New Note" to start your health journal.
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "10px 22px", borderRadius: "var(--r-md)",
              background: "var(--blue)", border: "none", color: "white",
              fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
              fontFamily: "inherit", boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            }}
          >
            <FaPlus size={11} /> Write your first note
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map(note => {
            const mc = MOOD_COLORS[note.mood] || MOOD_COLORS.okay;
            const moodMeta = MOODS.find(m => m.value === note.mood);
            return (
              <div
                key={note.id}
                style={{
                  background: "var(--bg-surface)",
                  border: `1px solid ${note.pinned ? "var(--amber-border)" : "var(--border)"}`,
                  borderRadius: "var(--r-lg)",
                  padding: "20px 22px",
                  boxShadow: note.pinned ? "0 2px 12px rgba(217,119,6,0.1)" : "var(--shadow-xs)",
                  display: "flex", flexDirection: "column", gap: 12,
                  transition: "box-shadow 0.2s",
                  position: "relative",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = note.pinned ? "0 2px 12px rgba(217,119,6,0.1)" : "var(--shadow-xs)"}
              >
                {/* Pin indicator */}
                {note.pinned && (
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                    color: "var(--amber)", fontSize: "0.75rem",
                  }}>
                    <FaThumbtack />
                  </div>
                )}

                {/* Header */}
                <div>
                  <h3 style={{
                    fontWeight: 700, fontSize: "0.98rem", color: "var(--text-heading)",
                    margin: "0 0 4px", paddingRight: note.pinned ? 20 : 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {note.title}
                  </h3>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", margin: 0 }}>
                    {new Date(note.createdAt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    {note.updatedAt !== note.createdAt && " · edited"}
                  </p>
                </div>

                {/* Mood chip */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 11px", borderRadius: "var(--r-full)",
                  background: mc.bg, border: `1px solid ${mc.border}`,
                  color: mc.text, fontSize: "0.76rem", fontWeight: 600,
                  alignSelf: "flex-start",
                }}>
                  {moodMeta?.emoji} {moodMeta?.label}
                </div>

                {/* Content preview */}
                <p style={{
                  fontSize: "0.875rem", color: "var(--text-muted)", margin: 0,
                  lineHeight: 1.65, flex: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {note.content}
                </p>

                {/* Tags */}
                {note.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {note.tags.map(tag => (
                      <span key={tag} className="badge badge-blue" style={{ fontSize: "0.68rem" }}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <button
                    onClick={() => handlePin(note.id)}
                    title={note.pinned ? "Unpin" : "Pin to top"}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "7px 10px", borderRadius: "var(--r-sm)",
                      border: `1px solid ${note.pinned ? "var(--amber-border)" : "var(--border)"}`,
                      background: note.pinned ? "var(--amber-bg)" : "transparent",
                      color: note.pinned ? "var(--amber)" : "var(--text-muted)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <FaThumbtack size={11} />
                  </button>
                  <button
                    onClick={() => handleEdit(note)}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 5, padding: "7px 0", borderRadius: "var(--r-sm)",
                      border: "1px solid var(--border)", background: "transparent",
                      color: "var(--text-muted)", cursor: "pointer",
                      fontSize: "0.78rem", fontWeight: 600, fontFamily: "inherit",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--blue-muted)"; e.currentTarget.style.color = "var(--blue)"; e.currentTarget.style.borderColor = "var(--blue-light)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <FaEdit size={11} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "7px 12px", borderRadius: "var(--r-sm)",
                      border: "1px solid var(--red-border)", background: "var(--red-bg)",
                      color: "var(--red)", cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}

export default HealthNotes;
