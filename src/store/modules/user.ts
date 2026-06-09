import { defineStore } from "pinia";
import { ref } from "vue";
import { store } from "@/store";
import { setToken, removeToken, setUserInfo, getUserInfo, type TokenData } from "@/utils/auth";
import { http } from "@/utils/http";
import type { userType } from "@/store/types";

const MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === "true";
const MOCK_USER = "admin";
const MOCK_PASS = "admin123";

function makeMockToken(username: string): { jwt: string; tokenData: TokenData } {
  // 构造一个假 JWT（三段 base64，后端未就绪时使用）
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: username,
      roles: ["admin"],
      exp: Math.floor(Date.now() / 1000) + 7200,
      iat: Math.floor(Date.now() / 1000),
    })
  );
  const signature = btoa("mock-signature");
  const jwt = `${header}.${payload}.${signature}`;

  const tokenData: TokenData = {
    accessToken: jwt,
    expires: Date.now() + 7200000,
    refreshToken: "mock-refresh-token",
  };

  return { jwt, tokenData };
}

export const useUserStore = defineStore("user", () => {
  const token = ref<string>("");
  const userInfo = ref<userType>(loadUserInfo());

  function loadUserInfo(): userType {
    const stored = getUserInfo();
    if (!stored) return {};
    return {
      username: stored.username,
      roles: stored.roles,
    };
  }

  /** 登录 */
  async function login(loginForm: { username: string; password: string }) {
    let jwt: string;
    let tokenData: TokenData;

    if (MOCK_AUTH) {
      // 虚假登录：校验账号密码
      if (loginForm.username !== MOCK_USER || loginForm.password !== MOCK_PASS) {
        throw new Error("用户名或密码错误");
      }
      const mock = makeMockToken(loginForm.username);
      jwt = mock.jwt;
      tokenData = mock.tokenData;
    } else {
      const res = await http.post<{ data: string }>("/admin/login", {
        username: loginForm.username,
        password: loginForm.password,
      });
      jwt = res.data;

      const { decodeJwt } = await import("@/utils/auth");
      const claims = decodeJwt(jwt);
      tokenData = {
        accessToken: jwt,
        expires: claims.exp * 1000,
        refreshToken: claims.exp.toString(),
      };
    }

    // 持久化
    setToken(tokenData);
    setUserInfo({
      username: loginForm.username,
      roles: ["admin"],
      refreshToken: tokenData.refreshToken,
      expires: tokenData.expires,
    });

    // 更新内存
    token.value = jwt;
    userInfo.value = {
      username: loginForm.username,
      roles: ["admin"],
    };
  }

  /** 登出 */
  async function logout() {
    if (!MOCK_AUTH) {
      try {
        await http.post("/logout");
      } catch {
        // 即使后端登出失败，前端也要清除状态
      }
    }
    userInfo.value = {};
    token.value = "";
    removeToken();
  }

  /** 刷新 Token */
  async function handRefreshToken(params: { refreshToken: string }) {
    if (MOCK_AUTH) {
      const mock = makeMockToken("admin");
      return { data: mock.jwt } as unknown as { data: string };
    }
    const res = await http.post<{ data: string }>("/refresh-token", {
      refreshToken: params.refreshToken,
    });
    return res;
  }

  return { token, userInfo, login, logout, handRefreshToken };
});

/** 在组件外使用 store */
export function useUserStoreHook() {
  return useUserStore(store);
}
