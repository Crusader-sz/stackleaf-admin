import { getCookie, setCookie, clearCookies } from "./cookie";
import { jwtDecode } from "jwt-decode";

// ── Constants ──────────────────────────────────────────────
const TOKEN_COOKIE = "authorized-token";
const MULTI_TAB_COOKIE = "multiple-tabs";
const USER_INFO_KEY = "user-info";

// ── Types ──────────────────────────────────────────────────
interface JwtPayload {
  sub: string; // username
  roles?: string[];
  exp: number;
  iat: number;
}

export interface TokenData {
  accessToken: string;
  expires: number; // timestamp in ms
  refreshToken: string;
}

export interface UserInfo {
  username: string;
  roles: string[];
  refreshToken: string;
  expires: number; // timestamp in ms
}

// ── Token (Cookie) ─────────────────────────────────────────

export function getToken(): TokenData | null {
  const raw = getCookie(TOKEN_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TokenData;
  } catch {
    return null;
  }
}

export function setToken(data: TokenData): void {
  // Cookie 带过期时间
  setCookie(TOKEN_COOKIE, JSON.stringify(data), {
    expires: new Date(data.expires),
  });
  // 多标签免登录标记（浏览器关闭即销毁）
  setCookie(MULTI_TAB_COOKIE, "true");
}

export function removeToken(): void {
  clearCookies();
  localStorage.removeItem(USER_INFO_KEY);
}

export function formatToken(token: string): string {
  return `Bearer ${token}`;
}

// ── User Info (localStorage) ────────────────────────────────

export function getUserInfo(): UserInfo | null {
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}

export function setUserInfo(info: UserInfo): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
}

// ── JWT Decode ─────────────────────────────────────────────

/** 解码 JWT 并返回 claims */
export function decodeJwt(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token);
}

// ── Multi-tab check ────────────────────────────────────────

/** 是否有有效的多标签会话（Cookie 未过期即认为已登录） */
export function hasMultiTabSession(): boolean {
  return getCookie(MULTI_TAB_COOKIE) === "true" && getToken() !== null;
}

/** 是否为已登录状态（Cookie 有效 + localStorage 用户信息完整） */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token || token.expires <= Date.now()) return false;
  const user = getUserInfo();
  return user !== null && user.username !== "";
}
