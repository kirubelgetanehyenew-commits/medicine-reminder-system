/**
 * db.js — MongoDB / Mongoose data layer
 *
 * All functions return Promises (async).
 * Routes must use await on every call.
 */

const mongoose = require("mongoose");

// ── Connection ────────────────────────────────────────────────────────────────

let connected = false;

async function connect() {
  if (connected || mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set.");
  await mongoose.connect(uri, { dbName: "meditrack" });
  connected = true;
  console.log("[DB] Connected to MongoDB Atlas");
}

// ── Schemas & Models ──────────────────────────────────────────────────────────

// User
const userSchema = new mongoose.Schema({
  _id:          { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:        { type: String, default: "" },
  passwordHash: { type: String, required: true },
  createdAt:    { type: Date, default: Date.now },
}, { _id: false });

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Medicine
const medicineSchema = new mongoose.Schema({
  _id:            { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  userId:         { type: String, required: true, index: true },
  name:           { type: String, required: true, trim: true },
  time:           { type: String, required: true },
  date:           { type: String, required: true },
  category:       { type: String, default: "Tablet" },
  dosage:         { type: String, default: "" },
  notes:          { type: String, default: "" },
  priority:       { type: String, default: "Medium" },
  frequency:      { type: String, default: "Daily" },
  pillsRemaining: { type: Number, default: null },
  refillAt:       { type: Number, default: 5 },
  completed:      { type: Boolean, default: false },
  completedAt:    { type: String, default: null },
  createdAt:      { type: String, default: () => new Date().toISOString() },
  updatedAt:      { type: String, default: () => new Date().toISOString() },
}, { _id: false });

const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);

// Note
const noteSchema = new mongoose.Schema({
  _id:       { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  userId:    { type: String, required: true, index: true },
  title:     { type: String, required: true, trim: true },
  content:   { type: String, required: true },
  mood:      { type: String, default: "okay" },
  tags:      { type: [String], default: [] },
  pinned:    { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

// Notification log (dedup)
const notifLogSchema = new mongoose.Schema({
  key:        { type: String, required: true, unique: true },
  medicineId: String,
  dateStr:    String,
  sentAt:     String,
  email:      Boolean,
  sms:        Boolean,
});

const NotifLog = mongoose.models.NotifLog || mongoose.model("NotifLog", notifLogSchema);

// ── Helpers: convert Mongoose doc → plain object with id ─────────────────────

function toObj(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj._id !== undefined && !obj.id) obj.id = String(obj._id);
  return obj;
}

// ── Users ─────────────────────────────────────────────────────────────────────

async function findUserByEmail(email) {
  await connect();
  const u = await User.findOne({ email: email.toLowerCase().trim() }).lean();
  return u ? { ...u, id: u._id } : null;
}

async function findUserById(id) {
  await connect();
  const u = await User.findById(id).lean();
  return u ? { ...u, id: u._id } : null;
}

async function createUser(userData) {
  await connect();
  const u = await User.create(userData);
  return { ...u.toObject(), id: u._id };
}

async function updateUser(id, updates) {
  await connect();
  const u = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  return u ? { ...u, id: u._id } : null;
}

// ── Medicines ─────────────────────────────────────────────────────────────────

async function getMedicines(userId, filters = {}) {
  await connect();
  const query = { userId, ...filters };
  const docs  = await Medicine.find(query).sort({ createdAt: -1 }).lean();
  return docs.map(d => ({ ...d, id: d._id }));
}

async function getAllMedicines() {
  await connect();
  const docs = await Medicine.find({}).lean();
  return docs.map(d => ({ ...d, id: d._id }));
}

async function addMedicine(data) {
  await connect();
  const doc = await Medicine.create(data);
  return { ...doc.toObject(), id: doc._id };
}

async function updateMedicine(id, userId, updates) {
  await connect();
  updates.updatedAt = new Date().toISOString();
  const doc = await Medicine.findOneAndUpdate(
    { _id: id, userId },
    { $set: updates },
    { new: true }
  ).lean();
  return doc ? { ...doc, id: doc._id } : null;
}

async function deleteMedicine(id, userId) {
  await connect();
  const res = await Medicine.deleteOne({ _id: id, userId });
  return res.deletedCount > 0;
}

// ── Notes ─────────────────────────────────────────────────────────────────────

async function getNotes(userId) {
  await connect();
  const docs = await Note.find({ userId }).sort({ pinned: -1, createdAt: -1 }).lean();
  return docs.map(d => ({ ...d, id: d._id }));
}

async function addNote(data) {
  await connect();
  const doc = await Note.create(data);
  return { ...doc.toObject(), id: doc._id };
}

async function updateNote(id, userId, updates) {
  await connect();
  updates.updatedAt = new Date().toISOString();
  const doc = await Note.findOneAndUpdate(
    { _id: id, userId },
    { $set: updates },
    { new: true }
  ).lean();
  return doc ? { ...doc, id: doc._id } : null;
}

async function deleteNote(id, userId) {
  await connect();
  const res = await Note.deleteOne({ _id: id, userId });
  return res.deletedCount > 0;
}

// ── Notification dedup ────────────────────────────────────────────────────────

async function wasNotified(medicineId, dateStr) {
  await connect();
  const key = `${medicineId}::${dateStr}`;
  return !!(await NotifLog.findOne({ key }).lean());
}

async function markNotified(medicineId, dateStr, meta = {}) {
  await connect();
  const key = `${medicineId}::${dateStr}`;
  await NotifLog.updateOne(
    { key },
    { $set: { key, medicineId, dateStr, sentAt: new Date().toISOString(), ...meta } },
    { upsert: true }
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  connect,
  // users
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  // medicines
  getMedicines,
  getAllMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  // notes
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  // notif log
  wasNotified,
  markNotified,
};
