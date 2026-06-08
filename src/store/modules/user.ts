import { defineStore } from "pinia";
import { ref } from "vue";
import { store } from "@/store";
import { setToken, removeToken } from "@/utils/auth";
import type { userType } from "@/store/types";

export const useUserStore = defineStore("user", () => {
  const token = ref("");
  const userInfo = ref<userType>({});

  /** 登录 */
  async function login(_loginForm: { username: string; password: string }) {
    // TODO: 对接真实接口后替换
    const mockToken = {
      accessToken: "mock-token",
      refreshToken: "mock-refresh",
      expires: Date.now() + 7200000,
    };
    setToken(mockToken);
    token.value = mockToken.accessToken;
  }

  /** 登出 */
  function logout() {
    removeToken();
    token.value = "";
    userInfo.value = {};
  }

  /** 刷新 Token */
  async function handRefreshToken(_params: { refreshToken: string }) {
    // TODO: 对接真实接口后替换
    return {
      data: {
        accessToken: "new-mock-token",
        refreshToken: "new-mock-refresh",
        expires: Date.now() + 7200000,
      },
    };
  }

  return { token, userInfo, login, logout, handRefreshToken };
});

/** 在组件外使用 store */
export function useUserStoreHook() {
  return useUserStore(store);
}
