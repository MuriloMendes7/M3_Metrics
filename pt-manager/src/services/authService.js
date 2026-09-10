// src/services/authService.js
const STORAGE_KEYS = {
  USERS: 'pt_manager_users',
  TOKEN: 'pt_manager_token',
};

const TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // 8 horas

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function getStoredUsers() {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function createToken(trainer) {
  const payload = {
    sub: trainer.id,
    name: trainer.name,
    email: trainer.email,
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  };
  return `ptm.${btoa(JSON.stringify(payload))}`;
}

function decodeToken(token) {
  if (!token || !token.startsWith('ptm.')) return null;
  try {
    const payload = JSON.parse(atob(token.slice(4)));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function registerTrainer({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('Já existe uma conta cadastrada com este e-mail.');
  }

  const passwordHash = await hashPassword(password);
  const newTrainer = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  saveStoredUsers([...users, newTrainer]);
  localStorage.setItem(STORAGE_KEYS.TOKEN, createToken(newTrainer));

  return { id: newTrainer.id, name: newTrainer.name, email: newTrainer.email };
}

export async function loginTrainer({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();
  const trainer = users.find((user) => user.email === normalizedEmail);

  if (!trainer) {
    throw new Error('E-mail ou senha inválidos.');
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== trainer.passwordHash) {
    throw new Error('E-mail ou senha inválidos.');
  }

  localStorage.setItem(STORAGE_KEYS.TOKEN, createToken(trainer));

  return { id: trainer.id, name: trainer.name, email: trainer.email };
}

export function logoutTrainer() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

export function getSession() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const payload = decodeToken(token);
  if (!payload) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    return null;
  }
  return { id: payload.sub, name: payload.name, email: payload.email };
}