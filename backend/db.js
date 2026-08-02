const fs   = require("fs");
const path = require("path");

const MEDICINES_FILE = path.join(__dirname, "data", "medicines.json");
const USERS_FILE     = path.join(__dirname, "data", "users.json");

// ── helpers ──────────────────────────────────────────────────────────────────

function readFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
}

function writeFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// ── medicines ─────────────────────────────────────────────────────────────────

function getMedicines(userId) {
  const all = readFile(MEDICINES_FILE);
  return all.filter((m) => m.userId === userId);
}

function getAllMedicines() {
  return readFile(MEDICINES_FILE);
}

function addMedicine(medicine) {
  const all = readFile(MEDICINES_FILE);
  all.push(medicine);
  writeFile(MEDICINES_FILE, all);
  return medicine;
}

function updateMedicine(id, userId, updates) {
  const all     = readFile(MEDICINES_FILE);
  const index   = all.findIndex((m) => m.id === id && m.userId === userId);
  if (index === -1) return null;
  all[index] = { ...all[index], ...updates, updatedAt: new Date().toISOString() };
  writeFile(MEDICINES_FILE, all);
  return all[index];
}

function deleteMedicine(id, userId) {
  const all     = readFile(MEDICINES_FILE);
  const index   = all.findIndex((m) => m.id === id && m.userId === userId);
  if (index === -1) return false;
  all.splice(index, 1);
  writeFile(MEDICINES_FILE, all);
  return true;
}

// ── users ─────────────────────────────────────────────────────────────────────

function getUsers() {
  return readFile(USERS_FILE);
}

function findUserByEmail(email) {
  return getUsers().find((u) => u.email === email) || null;
}

function findUserById(id) {
  return getUsers().find((u) => u.id === id) || null;
}

function createUser(user) {
  const all = readFile(USERS_FILE);
  all.push(user);
  writeFile(USERS_FILE, all);
  return user;
}

module.exports = {
  getMedicines,
  getAllMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  findUserByEmail,
  findUserById,
  createUser,
};
