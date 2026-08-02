const express  = require("express");
const { v4: uuidv4 } = require("uuid");
const { body, param, validationResult } = require("express-validator");

const db       = require("../db");
const { protect } = require("../middleware/authMiddleware");
const router   = express.Router();

// All medicine routes require authentication
router.use(protect);

// ── GET /api/medicines ────────────────────────────────────────────────────────
// Optional query params: ?completed=true|false&category=Tablet&search=aspirin

router.get("/", (req, res) => {
  try {
    let medicines = db.getMedicines(req.user.id);

    const { completed, category, search } = req.query;

    if (completed !== undefined) {
      const isDone = completed === "true";
      medicines = medicines.filter((m) => m.completed === isDone);
    }
    if (category) {
      medicines = medicines.filter(
        (m) => m.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (search) {
      medicines = medicines.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort newest first
    medicines.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ count: medicines.length, medicines });
  } catch (err) {
    console.error("GET /medicines error:", err);
    return res.status(500).json({ message: "Failed to retrieve medicines." });
  }
});

// ── GET /api/medicines/stats ──────────────────────────────────────────────────

router.get("/stats", (req, res) => {
  try {
    const medicines = db.getMedicines(req.user.id);
    const total     = medicines.length;
    const completed = medicines.filter((m) => m.completed).length;
    const pending   = total - completed;
    const rate      = total === 0 ? 0 : Math.round((completed / total) * 100);

    return res.json({ total, completed, pending, successRate: rate });
  } catch (err) {
    return res.status(500).json({ message: "Failed to retrieve stats." });
  }
});

// ── GET /api/medicines/:id ────────────────────────────────────────────────────

router.get("/:id", (req, res) => {
  try {
    const medicines = db.getMedicines(req.user.id);
    const medicine  = medicines.find((m) => m.id === req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found." });
    return res.json(medicine);
  } catch (err) {
    return res.status(500).json({ message: "Failed to retrieve medicine." });
  }
});

// ── POST /api/medicines ───────────────────────────────────────────────────────

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Medicine name is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("category")
      .optional()
      .isIn(["Tablet", "Capsule", "Syrup", "Injection", "Vitamin", "Other"])
      .withMessage("Invalid category"),
    body("priority")
      .optional()
      .isIn(["High", "Medium", "Low"])
      .withMessage("Invalid priority"),
    body("frequency")
      .optional()
      .isIn(["Daily", "Weekly", "Monthly", "As needed"])
      .withMessage("Invalid frequency"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, time, date, category, dosage, notes, priority, frequency, pillsRemaining, refillAt } = req.body;

      const medicine = db.addMedicine({
        id:              uuidv4(),
        userId:          req.user.id,
        name:            name.trim(),
        time,
        date,
        category:        category        || "Tablet",
        dosage:          dosage          || "",
        notes:           notes           || "",
        priority:        priority        || "Medium",
        frequency:       frequency       || "Daily",
        pillsRemaining:  pillsRemaining  != null ? Number(pillsRemaining) : null,
        refillAt:        refillAt        != null ? Number(refillAt)        : 5,
        completed:       false,
        createdAt:       new Date().toISOString(),
        updatedAt:       new Date().toISOString(),
      });

      return res.status(201).json({ message: "Medicine added.", medicine });
    } catch (err) {
      console.error("POST /medicines error:", err);
      return res.status(500).json({ message: "Failed to add medicine." });
    }
  }
);

// ── PUT /api/medicines/:id ────────────────────────────────────────────────────

router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("category")
      .optional()
      .isIn(["Tablet", "Capsule", "Syrup", "Injection", "Vitamin", "Other"])
      .withMessage("Invalid category"),
    body("priority")
      .optional()
      .isIn(["High", "Medium", "Low"])
      .withMessage("Invalid priority"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updated = db.updateMedicine(req.params.id, req.user.id, req.body);
      if (!updated) return res.status(404).json({ message: "Medicine not found." });
      return res.json({ message: "Medicine updated.", medicine: updated });
    } catch (err) {
      console.error("PUT /medicines/:id error:", err);
      return res.status(500).json({ message: "Failed to update medicine." });
    }
  }
);

// ── PATCH /api/medicines/:id/complete ────────────────────────────────────────

router.patch("/:id/complete", (req, res) => {
  try {
    const medicines = db.getMedicines(req.user.id);
    const med       = medicines.find((m) => m.id === req.params.id);
    if (!med) return res.status(404).json({ message: "Medicine not found." });

    const updated = db.updateMedicine(req.params.id, req.user.id, {
      completed:   !med.completed,
      completedAt: !med.completed ? new Date().toISOString() : null,
    });

    return res.json({ message: "Status toggled.", medicine: updated });
  } catch (err) {
    return res.status(500).json({ message: "Failed to toggle status." });
  }
});

// ── DELETE /api/medicines/:id ─────────────────────────────────────────────────

router.delete("/:id", (req, res) => {
  try {
    const deleted = db.deleteMedicine(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ message: "Medicine not found." });
    return res.json({ message: "Medicine deleted." });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete medicine." });
  }
});

// ── PATCH /api/medicines/:id/refill ──────────────────────────────────────────
// Resets pillsRemaining to the supplied count (or removes the stock field)

router.patch("/:id/refill", (req, res) => {
  try {
    const { pillsRemaining, refillAt } = req.body;
    const updates = {};
    if (pillsRemaining != null) updates.pillsRemaining = Number(pillsRemaining);
    if (refillAt       != null) updates.refillAt       = Number(refillAt);

    const updated = db.updateMedicine(req.params.id, req.user.id, updates);
    if (!updated) return res.status(404).json({ message: "Medicine not found." });
    return res.json({ message: "Refill updated.", medicine: updated });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update refill." });
  }
});

// ── PATCH /api/medicines/:id/dose ─────────────────────────────────────────────
// Decrement pillsRemaining by 1 when a dose is taken

router.patch("/:id/dose", (req, res) => {
  try {
    const meds = db.getMedicines(req.user.id);
    const med  = meds.find((m) => m.id === req.params.id);
    if (!med) return res.status(404).json({ message: "Medicine not found." });

    const updates = {};
    if (med.pillsRemaining != null && med.pillsRemaining > 0) {
      updates.pillsRemaining = med.pillsRemaining - 1;
    }
    // Also mark completed for the day
    updates.completed    = true;
    updates.completedAt  = new Date().toISOString();

    const updated = db.updateMedicine(req.params.id, req.user.id, updates);
    return res.json({ message: "Dose recorded.", medicine: updated });
  } catch (err) {
    return res.status(500).json({ message: "Failed to record dose." });
  }
});

module.exports = router;


module.exports = router;
