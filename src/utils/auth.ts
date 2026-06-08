const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expires: number;
}

export function getToken(): TokenData | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setToken(data: TokenData): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function formatToken(token: string): string {
  return `Bearer ${token}`;
}
