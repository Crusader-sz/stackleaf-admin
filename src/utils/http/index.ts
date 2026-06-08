import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer,
} from "axios";
import type {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig,
} from "./types.d";
import { stringify } from "qs";
import NProgress from "./progress";
import { getToken, formatToken } from "@/utils/auth";
import { useUserStore } from "@/store/modules/user";

const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
};

class PureHttp {
  /** 防止重复刷新 token */
  private static isRefreshing = false;

  /** token 过期后暂存待执行的请求 */
  private static requests: Array<(token: string) => void> = [];

  /** 当前 axios 实例 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** 设置 Authorization 头 */
  private static setAuthHeader(config: PureHttpRequestConfig, token: string): void {
    config.headers.set("Authorization", formatToken(token));
  }

  /** 重新挂载刷新后的 token 到原始请求 */
  private static retryOriginalRequest(
    config: PureHttpRequestConfig
  ): Promise<PureHttpRequestConfig> {
    return new Promise((resolve) => {
      PureHttp.requests.push((token: string) => {
        PureHttp.setAuthHeader(config, token);
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig) => {
        NProgress.start();

        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }

        // 请求白名单，不需要 token 的接口
        const whiteList = ["/refresh-token", "/login"];
        if (whiteList.some((url) => config.url?.endsWith(url))) {
          return config;
        }

        const data = getToken();
        if (!data) return config;

        const expired = data.expires - Date.now() <= 0;

        if (expired) {
          if (!PureHttp.isRefreshing) {
            PureHttp.isRefreshing = true;
            try {
              const userStore = useUserStore();
              const res = await userStore.handRefreshToken({
                refreshToken: data.refreshToken,
              });
              const newToken = res.data.accessToken;
              PureHttp.requests.forEach((cb) => cb(newToken));
              PureHttp.requests = [];
              PureHttp.setAuthHeader(config, newToken);
            } finally {
              PureHttp.isRefreshing = false;
            }
          } else {
            return PureHttp.retryOriginalRequest(config);
          }
        } else {
          PureHttp.setAuthHeader(config, data.accessToken);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    PureHttp.axiosInstance.interceptors.response.use(
      (response: PureHttpResponse) => {
        NProgress.done();

        if (typeof response.config.beforeResponseCallback === "function") {
          response.config.beforeResponseCallback(response);
          return response.data;
        }

        return response.data;
      },
      (error: PureHttpError) => {
        NProgress.done();
        error.isCancelRequest = Axios.isCancel(error);
        return Promise.reject(error);
      }
    );
  }

  /** 通用请求 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = { method, url, ...param, ...axiosConfig } as PureHttpRequestConfig;
    return PureHttp.axiosInstance.request(config);
  }

  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("post", url, params, config);
  }

  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("get", url, params, config);
  }

  public put<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("put", url, params, config);
  }

  public delete<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("delete", url, params, config);
  }
}

export const http = new PureHttp();
