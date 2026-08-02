const express  = require("express");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");

const db       = require("../db");
const { protect } = require("../middleware/authMiddleware");
const router   = express.Router();

router.use(protect);

// ── GET /api/notes ────────────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const notes = await db.getNotes(req.user.id);
    return res.json({ count: notes.length, notes });
  } catch (err) {
    console.error("GET /notes:", err);
    return res.status(500).json({ message: "Failed to fetch notes." });
  }
});

// ── POST /api/notes ───────────────────────────────────────────────────────────

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("mood").optional()
      .isIn(["great","good","okay","bad","terrible"])
      .withMessage("Invalid mood value"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, content, mood = "okay", tags = [] } = req.body;
      const note = await db.addNote({
        _id:       uuidv4(),
        userId:    req.user.id,
        title:     title.trim(),
        content:   content.trim(),
        mood,
        tags,
        pinned:    false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return res.status(201).json({ message: "Note created.", note });
    } catch (err) {
      console.error("POST /notes:", err);
      return res.status(500).json({ message: "Failed to create note." });
    }
  }
);

// ── PUT /api/notes/:id ────────────────────────────────────────────────────────

router.put(
  "/:id",
  [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("content").optional().trim().notEmpty().withMessage("Content cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updated = await db.updateNote(req.params.id, req.user.id, req.body);
      if (!updated) return res.status(404).json({ message: "Note not found." });
      return res.json({ message: "Note updated.", note: updated });
    } catch (err) {
      return res.status(500).json({ message: "Failed to update note." });
    }
  }
);

// ── PATCH /api/notes/:id/pin ──────────────────────────────────────────────────

router.patch("/:id/pin", async (req, res) => {
  try {
    const notes = await db.getNotes(req.user.id);
    const note  = notes.find(n => n.id === req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found." });

    const updated = await db.updateNote(req.params.id, req.user.id, { pinned: !note.pinned });
    return res.json({ message: "Pin toggled.", note: updated });
  } catch (err) {
    return res.status(500).json({ message: "Failed to pin note." });
  }
});

// ── DELETE /api/notes/:id ─────────────────────────────────────────────────────

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db.deleteNote(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ message: "Note not found." });
    return res.json({ message: "Note deleted." });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete note." });
  }
});

module.exports = router;
