<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import ThemeToggle from "@/components/ThemeToggle.vue";
import AppInput from "@/components/AppInput.vue";
import AppButton from "@/components/AppButton.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const form = reactive({
  username: "",
  password: "",
});

const errors = reactive({
  username: "",
  password: "",
});

const loading = ref(false);

function validate(): boolean {
  let valid = true;

  if (!form.username.trim()) {
    errors.username = "请输入用户名";
    valid = false;
  } else {
    errors.username = "";
  }

  if (!form.password) {
    errors.password = "请输入密码";
    valid = false;
  } else if (form.password.length < 6) {
    errors.password = "密码长度至少 6 位";
    valid = false;
  } else {
    errors.password = "";
  }

  return valid;
}

async function handleSubmit() {
  if (!validate()) return;

  loading.value = true;
  try {
    await userStore.login({
      username: form.username.trim(),
      password: form.password,
    });
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  } catch {
    errors.username = "用户名或密码错误";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center px-4 bg-slate-50 dark:bg-slate-900"
  >
    <!-- Dot grid background -->
    <div
      class="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
      style="
        background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
        background-size: 24px 24px;
      "
      aria-hidden="true"
    />

    <!-- Theme toggle -->
    <div class="absolute top-4 right-4 z-10">
      <ThemeToggle />
    </div>

    <!-- Login card -->
    <div
      class="relative w-full max-w-[400px] rounded-xl bg-white dark:bg-slate-800 shadow-lg dark:shadow-2xl overflow-hidden"
    >
      <!-- Accent bar -->
      <div class="h-1 w-full bg-blue-600 dark:bg-blue-500" aria-hidden="true" />

      <div class="px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
        <!-- Brand -->
        <div class="text-center mb-8">
          <h1
            class="font-[--font-heading] text-2xl font-bold text-slate-800 dark:text-white tracking-tight"
          >
            StackLeaf
          </h1>
          <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-[--font-body]">
            后台管理系统
          </p>
        </div>

        <!-- Form -->
        <form class="flex flex-col gap-5" novalidate @submit.prevent="handleSubmit">
          <AppInput
            v-model="form.username"
            label="用户名"
            placeholder="请输入用户名"
            :error="errors.username"
            autocomplete="username"
          />

          <AppInput
            v-model="form.password"
            label="密码"
            type="password"
            placeholder="请输入密码"
            :error="errors.password"
            autocomplete="current-password"
          />

          <div class="pt-1">
            <AppButton variant="primary" block :loading="loading" @click="handleSubmit">
              登 录
            </AppButton>
          </div>
        </form>

        <p class="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 font-[--font-body]">
          StackLeaf Admin v1.0
        </p>
      </div>
    </div>
  </div>
</template>
