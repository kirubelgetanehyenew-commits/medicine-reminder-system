const express   = require("express");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");

const db     = require("../db");
const router = express.Router();

// ── helpers ───────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function safeUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone || "" };
}

// ── POST /api/auth/register ───────────────────────────────────────────────────

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^\+?[1-9]\d{6,14}$/)
      .withMessage("Enter a valid phone number with country code (e.g. +12345678901)"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    try {
      if (db.findUserByEmail(email)) {
        return res.status(409).json({ message: "Email already in use." });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = db.createUser({
        id: uuidv4(),
        name,
        email,
        phone,           // stored for SMS notifications
        passwordHash,
        createdAt: new Date().toISOString(),
      });

      const token = signToken(user);

      // Welcome email (non-blocking)
      try {
        const { sendEmailNotification } = require("../services/notificationService");
        sendEmailNotification({
          to:           email,
          userName:     name,
          medicineName: "Welcome to MediTrack!",
          time:         "—",
          dosage:       "",
          category:     "",
        }).catch(() => {});
      } catch (_) {}

      return res.status(201).json({
        message: "Account created successfully.",
        token,
        user:    safeUser(user),
      });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Server error during registration." });
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = signToken(user);
      return res.json({
        message: "Login successful.",
        token,
        user:    safeUser(user),
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error during login." });
    }
  }
);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json(safeUser(user));
});

// ── PATCH /api/auth/profile ───────────────────────────────────────────────────

router.patch(
  "/profile",
  protect,
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("phone").optional().trim()
      .matches(/^\+?[1-9]\d{6,14}$/)
      .withMessage("Enter a valid phone number with country code"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const users = db.getUsers ? undefined : null; // use db helpers
    const all   = require("fs").existsSync(require("path").join(__dirname, "../data/users.json"))
      ? JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "../data/users.json"), "utf8"))
      : [];

    const idx = all.findIndex(u => u.id === req.user.id);
    if (idx === -1) return res.status(404).json({ message: "User not found." });

    const { name, email, phone } = req.body;
    if (name)  all[idx].name  = name.trim();
    if (email) all[idx].email = email.trim();
    if (phone) all[idx].phone = phone.trim();

    require("fs").writeFileSync(
      require("path").join(__dirname, "../data/users.json"),
      JSON.stringify(all, null, 2)
    );

    return res.json(safeUser(all[idx]));
  }
);

// ── POST /api/auth/change-password ────────────────────────────────────────────

router.post(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { currentPassword, newPassword } = req.body;
    try {
      const user = db.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found." });

      const match = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!match) return res.status(401).json({ message: "Current password is incorrect." });

      const newHash = await bcrypt.hash(newPassword, 12);

      const all = JSON.parse(require("fs").readFileSync(
        require("path").join(__dirname, "../data/users.json"), "utf8"
      ));
      const idx = all.findIndex(u => u.id === req.user.id);
      all[idx].passwordHash = newHash;
      require("fs").writeFileSync(
        require("path").join(__dirname, "../data/users.json"),
        JSON.stringify(all, null, 2)
      );

      return res.json({ message: "Password updated successfully." });
    } catch (err) {
      console.error("Change password error:", err);
      return res.status(500).json({ message: "Server error." });
    }
  }
);

module.exports = router;
