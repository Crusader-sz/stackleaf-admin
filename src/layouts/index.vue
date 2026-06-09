<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import ThemeToggle from "@/components/ThemeToggle.vue";

const router = useRouter();
const userStore = useUserStore();

const isCollapse = ref(false);

function toggleSidebar() {
  isCollapse.value = !isCollapse.value;
}

async function handleLogout() {
  await userStore.logout();
  router.push("/login");
}
</script>

<template>
  <el-container class="h-screen">
    <!-- Sidebar -->
    <el-aside
      :width="isCollapse ? '64px' : '220px'"
      class="transition-all duration-300 bg-slate-800"
    >
      <div class="flex items-center h-14 px-4 bg-slate-900">
        <h1
          v-show="!isCollapse"
          class="font-[--font-heading] text-base font-bold text-white tracking-tight truncate"
        >
          StackLeaf
        </h1>
        <span v-show="isCollapse" class="font-[--font-heading] text-base font-bold text-white"
          >S</span
        >
      </div>

      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        background-color="#1e293b"
        text-color="#94a3b8"
        active-text-color="#60a5fa"
        class="border-r-0"
      >
        <el-menu-item index="/dashboard">
          <el-icon
            ><svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-5 h-5"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /></svg
          ></el-icon>
          <template #title>首页</template>
        </el-menu-item>

        <el-sub-menu index="/system">
          <template #title>
            <el-icon
              ><svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-5 h-5"
              >
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                /></svg
            ></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/user">
            <el-icon
              ><svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-5 h-5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg
            ></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- Main -->
    <el-container>
      <el-header
        class="h-14 flex items-center justify-between px-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          @click="toggleSidebar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="w-5 h-5"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div class="flex items-center gap-2">
          <ThemeToggle />

          <!-- User avatar & dropdown -->
          <el-dropdown trigger="click" @command="handleLogout">
            <div class="flex items-center gap-2 cursor-pointer select-none">
              <el-avatar :size="32" class="bg-blue-600 text-white text-sm font-medium">
                {{ userStore.userInfo.username?.charAt(0)?.toUpperCase() || "U" }}
              </el-avatar>
              <span class="text-sm text-slate-700 dark:text-slate-200 hidden sm:inline">
                {{ userStore.userInfo.username || "管理员" }}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="w-4 h-4 text-slate-400"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="w-4 h-4 mr-2 inline-block align-middle"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="bg-slate-50 dark:bg-slate-900">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-menu {
  border-right: none;
  min-height: calc(100vh - 56px);
}

.el-aside {
  overflow: hidden;
}
</style>
