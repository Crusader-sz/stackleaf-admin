/**
 * Cookie 工具 — 支持自动过期、路径控制
 */
type CookieOptions = {
  expires?: Date | number; // Date 对象或天数
  path?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
};

function encode(val: string): string {
  return encodeURIComponent(val);
}

function decode(val: string): string {
  return decodeURIComponent(val);
}

export function getCookie(key: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return match ? decode(match[1]) : null;
}

export function setCookie(key: string, value: string, options: CookieOptions = {}): void {
  const { expires, path = "/", secure, sameSite = "Lax" } = options;

  let cookie = `${key}=${encode(value)}; path=${path}; SameSite=${sameSite}`;

  if (expires) {
    const expDate =
      typeof expires === "number"
        ? new Date(Date.now() + expires * 864e5) // days → ms
        : expires;
    cookie += `; expires=${expDate.toUTCString()}`;
  }

  if (secure || location.protocol === "https:") {
    cookie += "; secure";
  }

  document.cookie = cookie;
}

export function removeCookie(key: string, path = "/"): void {
  document.cookie = `${key}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/** 批量清除所有业务 Cookie */
export function clearCookies(): void {
  removeCookie("authorized-token");
  removeCookie("multiple-tabs");
}
