// src/services/profileService.js
const STORAGE_KEY = 'pt_manager_profiles';

const DEFAULT_PROFILE = {
  avatarDataUrl: null,
  bio: '',
  specialty: '',
  phone: '',
};

function getAllProfiles() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAllProfiles(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getProfile(trainerId) {
  const all = getAllProfiles();
  return { ...DEFAULT_PROFILE, ...(all[trainerId] || {}) };
}

export async function saveProfile(trainerId, profileData) {
  const all = getAllProfiles();
  const updated = { ...DEFAULT_PROFILE, ...(all[trainerId] || {}), ...profileData };
  all[trainerId] = updated;
  saveAllProfiles(all);
  return updated;
}