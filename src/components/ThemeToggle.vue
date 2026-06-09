<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const { resolvedTheme, toggleTheme } = useTheme();
</script>

<template>
  <button
    type="button"
    :aria-label="resolvedTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
    :title="resolvedTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
    class="relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    @click="toggleTheme"
  >
    <!-- Sun icon（当前为暗色 → 点击切亮色） -->
    <svg
      v-if="resolvedTheme === 'dark'"
      class="w-5 h-5 transition-transform duration-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
    <!-- Moon icon（当前为亮色 → 点击切暗色） -->
    <svg
      v-else
      class="w-5 h-5 transition-transform duration-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>
