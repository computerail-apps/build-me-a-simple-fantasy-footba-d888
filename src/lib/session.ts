const SESSION_KEY = 'gridiron_session_id';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const USERNAME_KEY = 'gridiron_last_username';

export function getLastUsername(): string {
  return localStorage.getItem(USERNAME_KEY) ?? '';
}

export function setLastUsername(username: string): void {
  localStorage.setItem(USERNAME_KEY, username);
}
