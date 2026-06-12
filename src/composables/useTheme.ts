import { ref, computed } from "vue";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "stackleaf-theme";

// Init logic must stay in sync with FOUC script in index.html
/** 用户选择的模式（全局单例） */
const themeMode = ref<ThemeMode>(getInitialMode());

/** 解析后的实际主题（light 或 dark） */
const resolvedTheme = ref<ResolvedTheme>(resolveTheme(themeMode.value));

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

function applyTheme(t: ResolvedTheme) {
  if (t === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// 立即应用初始主题
applyTheme(resolvedTheme.value);

/** 系统主题变化监听器 */
let mediaQuery: MediaQueryList | null = null;

function watchSystem() {
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onSystemChange);
}

function unwatchSystem() {
  if (mediaQuery) {
    mediaQuery.removeEventListener("change", onSystemChange);
    mediaQuery = null;
  }
}

function onSystemChange(e: MediaQueryListEvent) {
  if (themeMode.value === "system") {
    resolvedTheme.value = e.matches ? "dark" : "light";
    applyTheme(resolvedTheme.value);
  }
}

// 初始化时启动系统监听（mode 为 system 时需要）
if (themeMode.value === "system") {
  watchSystem();
}

export function useTheme() {
  const isDark = computed(() => resolvedTheme.value === "dark");

  function setTheme(mode: ThemeMode) {
    themeMode.value = mode;
    localStorage.setItem(STORAGE_KEY, mode);

    if (mode === "system") {
      watchSystem();
      resolvedTheme.value = resolveTheme("system");
    } else {
      unwatchSystem();
      resolvedTheme.value = mode;
    }

    applyTheme(resolvedTheme.value);
  }

  /** 快速切换亮/暗（login 页开关用） */
  function toggleTheme() {
    setTheme(resolvedTheme.value === "dark" ? "light" : "dark");
  }

  return {
    /** 用户选择的模式：light | dark | system */
    themeMode,
    /** 解析后的实际主题：light | dark */
    resolvedTheme,
    /** 是否为暗色模式 */
    isDark,
    setTheme,
    toggleTheme,
  };
}
