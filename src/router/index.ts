import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { hasMultiTabSession, getUserInfo } from "@/utils/auth";

/** 公开路由（不需要登录） */
const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/login.vue"),
    meta: { title: "登录", public: true },
  },
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
        meta: { title: "首页" },
      },
      {
        path: "user",
        name: "UserList",
        component: () => import("@/pages/user/index.vue"),
        meta: { title: "用户管理" },
      },
    ],
  },
];

/** 错误页面 */
const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/pages/403.vue"),
    meta: { title: "403", public: true },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/pages/404.vue"),
    meta: { title: "404", public: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...authRoutes, ...errorRoutes],
});

router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - StackLeaf Admin`;
  }

  const isLoggedIn = hasMultiTabSession();
  const userInfo = getUserInfo();

  // ── 已登录 ──────────────────────────────────
  if (isLoggedIn && userInfo) {
    // 角色权限检查
    const requiredRoles = to.meta.roles as string[] | undefined;
    if (
      requiredRoles &&
      requiredRoles.length > 0 &&
      !requiredRoles.some((r) => userInfo.roles.includes(r))
    ) {
      next({ name: "403", replace: true });
      return;
    }

    // 已登录访问登录页 → 留在首页
    if (to.name === "Login") {
      next({ path: "/", replace: true });
      return;
    }

    next();
    return;
  }

  // ── 未登录 ──────────────────────────────────
  if (to.meta.public) {
    next();
    return;
  }

  // 清除残留 token 并跳转登录
  import("@/utils/auth").then(({ removeToken }) => {
    removeToken();
    next({ name: "Login", query: { redirect: to.fullPath }, replace: true });
  });
});

/** 重置路由（用于登出后清除动态路由） */
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(),
    routes: [...publicRoutes, ...authRoutes, ...errorRoutes],
  });
  // @ts-expect-error 替换 router matcher
  router.matcher = newRouter.matcher;
}

export default router;
