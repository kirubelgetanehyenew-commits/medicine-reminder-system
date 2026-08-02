const express  = require("express");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");

const db       = require("../db");
const { protect } = require("../middleware/authMiddleware");
const router   = express.Router();

router.use(protect);

// ── GET /api/medicines ────────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    let medicines = await db.getMedicines(req.user.id);

    const { completed, category, search } = req.query;
    if (completed !== undefined) {
      const isDone = completed === "true";
      medicines = medicines.filter(m => m.completed === isDone);
    }
    if (category) {
      medicines = medicines.filter(m => m.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      medicines = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    }

    return res.json({ count: medicines.length, medicines });
  } catch (err) {
    console.error("GET /medicines:", err);
    return res.status(500).json({ message: "Failed to retrieve medicines." });
  }
});

// ── GET /api/medicines/stats ──────────────────────────────────────────────────

router.get("/stats", async (req, res) => {
  try {
    const medicines = await db.getMedicines(req.user.id);
    const total     = medicines.length;
    const completed = medicines.filter(m => m.completed).length;
    const pending   = total - completed;
    const rate      = total === 0 ? 0 : Math.round((completed / total) * 100);
    return res.json({ total, completed, pending, successRate: rate });
  } catch (err) {
    return res.status(500).json({ message: "Failed to retrieve stats." });
  }
});

// ── GET /api/medicines/:id ────────────────────────────────────────────────────

router.get("/:id", async (req, res) => {
  try {
    const medicines = await db.getMedicines(req.user.id);
    const med = medicines.find(m => m.id === req.params.id);
    if (!med) return res.status(404).json({ message: "Medicine not found." });
    return res.json(med);
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
    body("category").optional()
      .isIn(["Tablet","Capsule","Syrup","Injection","Vitamin","Other"])
      .withMessage("Invalid category"),
    body("priority").optional()
      .isIn(["High","Medium","Low"])
      .withMessage("Invalid priority"),
    body("frequency").optional()
      .isIn(["Daily","Weekly","Monthly","As needed"])
      .withMessage("Invalid frequency"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, time, date, category, dosage, notes, priority, frequency, pillsRemaining, refillAt } = req.body;

      const medicine = await db.addMedicine({
        _id:            uuidv4(),
        userId:         req.user.id,
        name:           name.trim(),
        time,
        date,
        category:       category        || "Tablet",
        dosage:         dosage          || "",
        notes:          notes           || "",
        priority:       priority        || "Medium",
        frequency:      frequency       || "Daily",
        pillsRemaining: pillsRemaining  != null ? Number(pillsRemaining) : null,
        refillAt:       refillAt        != null ? Number(refillAt)        : 5,
        completed:      false,
        completedAt:    null,
        createdAt:      new Date().toISOString(),
        updatedAt:      new Date().toISOString(),
      });

      return res.status(201).json({ message: "Medicine added.", medicine });
    } catch (err) {
      console.error("POST /medicines:", err);
      return res.status(500).json({ message: "Failed to add medicine." });
    }
  }
);

// ── PUT /api/medicines/:id ────────────────────────────────────────────────────

router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("category").optional()
      .isIn(["Tablet","Capsule","Syrup","Injection","Vitamin","Other"])
      .withMessage("Invalid category"),
    body("priority").optional()
      .isIn(["High","Medium","Low"])
      .withMessage("Invalid priority"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updated = await db.updateMedicine(req.params.id, req.user.id, req.body);
      if (!updated) return res.status(404).json({ message: "Medicine not found." });
      return res.json({ message: "Medicine updated.", medicine: updated });
    } catch (err) {
      console.error("PUT /medicines/:id:", err);
      return res.status(500).json({ message: "Failed to update medicine." });
    }
  }
);

// ── PATCH /api/medicines/:id/complete ────────────────────────────────────────

router.patch("/:id/complete", async (req, res) => {
  try {
    const medicines = await db.getMedicines(req.user.id);
    const med = medicines.find(m => m.id === req.params.id);
    if (!med) return res.status(404).json({ message: "Medicine not found." });

    const updated = await db.updateMedicine(req.params.id, req.user.id, {
      completed:   !med.completed,
      completedAt: !med.completed ? new Date().toISOString() : null,
    });
    return res.json({ message: "Status toggled.", medicine: updated });
  } catch (err) {
    return res.status(500).json({ message: "Failed to toggle status." });
  }
});

// ── PATCH /api/medicines/:id/dose ─────────────────────────────────────────────

router.patch("/:id/dose", async (req, res) => {
  try {
    const medicines = await db.getMedicines(req.user.id);
    const med = medicines.find(m => m.id === req.params.id);
    if (!med) return res.status(404).json({ message: "Medicine not found." });

    const updates = {
      completed:   true,
      completedAt: new Date().toISOString(),
    };
    if (med.pillsRemaining != null && med.pillsRemaining > 0) {
      updates.pillsRemaining = med.pillsRemaining - 1;
    }

    const updated = await db.updateMedicine(req.params.id, req.user.id, updates);
    return res.json({ message: "Dose recorded.", medicine: updated });
  } catch (err) {
    return res.status(500).json({ message: "Failed to record dose." });
  }
});

// ── PATCH /api/medicines/:id/refill ──────────────────────────────────────────

router.patch("/:id/refill", async (req, res) => {
  try {
    const { pillsRemaining, refillAt } = req.body;
    const updates = {};
    if (pillsRemaining != null) updates.pillsRemaining = Number(pillsRemaining);
    if (refillAt       != null) updates.refillAt       = Number(refillAt);

    const updated = await db.updateMedicine(req.params.id, req.user.id, updates);
    if (!updated) return res.status(404).json({ message: "Medicine not found." });
    return res.json({ message: "Refill updated.", medicine: updated });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update refill." });
  }
});

// ── DELETE /api/medicines/:id ─────────────────────────────────────────────────

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db.deleteMedicine(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ message: "Medicine not found." });
    return res.json({ message: "Medicine deleted." });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete medicine." });
  }
});

module.exports = router;
