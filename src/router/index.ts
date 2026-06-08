import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

/** 公开路由（不需要登录） */
const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/login.vue"),
    meta: { title: "登录" }
  }
];

/** 需要登录的路由 */
const authRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/index.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/pages/dashboard.vue"),
        meta: { title: "首页" }
      }
    ]
  }
];

/** 错误页面 */
const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/pages/403.vue"),
    meta: { title: "403" }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/pages/404.vue"),
    meta: { title: "404" }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...authRoutes, ...errorRoutes]
});

/** 重置路由（用于登出后清除动态路由） */
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(),
    routes: [...publicRoutes, ...authRoutes, ...errorRoutes]
  });
  // @ts-expect-error 替换 router matcher
  router.matcher = newRouter.matcher;
}

export default router;
