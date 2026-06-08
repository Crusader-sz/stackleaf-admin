<script setup lang="ts">
</script>

<template>
  <el-container class="h-screen">
    <el-aside width="200px" class="bg-gray-800">
      <div class="p-4 text-center text-white text-lg font-bold">StackLeaf</div>
      <el-menu
        default-active="/"
        class="el-menu-vertical"
        background-color="#1f2937"
        text-color="#9ca3af"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/">
          <span>首页</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="bg-white shadow flex items-center justify-between px-4">
        <span class="text-lg font-medium">StackLeaf Admin</span>
      </el-header>
      <el-main class="bg-gray-50">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-menu-vertical {
  border-right: none;
}
</style>
