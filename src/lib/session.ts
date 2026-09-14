const SESSION_KEY = 'gridiron_session_id';
const USERNAME_KEY = 'gridiron_last_username';

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function setLastUsername(username: string): void {
  localStorage.setItem(USERNAME_KEY, username);
}

export function getLastUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}
