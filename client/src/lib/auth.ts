const TOKEN_KEY = "doelio.token";
const USER_KEY = "doelio.user";

// localStorage is blocked in sandboxed iframes — wrap every access
function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // silently ignore — in-memory fallback is still set below
  }
}

function lsRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // silently ignore
  }
}

let authToken: string | null = lsGet(TOKEN_KEY);
let currentUser: { id: string; email: string; name: string } | null = (() => {
  const raw = lsGet(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

export function setAuth(token: string, user: { id: string; email: string; name: string }) {
  authToken = token;
  currentUser = user;
  lsSet(TOKEN_KEY, token);
  lsSet(USER_KEY, JSON.stringify(user));
  // Trigger storage event for cross-tab sync (same-tab listeners won't fire automatically)
  window.dispatchEvent(new Event("storage"));
}

export function clearAuth() {
  authToken = null;
  currentUser = null;
  lsRemove(TOKEN_KEY);
  lsRemove(USER_KEY);
  window.dispatchEvent(new Event("storage"));
}

export function getToken(): string | null {
  return authToken;
}

export function getUser() {
  return currentUser;
}

export function isAuthenticated(): boolean {
  return !!authToken && !!currentUser;
}
