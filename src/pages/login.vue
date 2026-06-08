<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();
const userStore = useUserStore();

const loginForm = ref({
  username: "",
  password: ""
});

async function handleLogin() {
  await userStore.login(loginForm.value);
  router.push("/");
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <el-card class="w-96">
      <template #header>
        <h2 class="text-xl font-bold text-center">StackLeaf Admin</h2>
      </template>
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
