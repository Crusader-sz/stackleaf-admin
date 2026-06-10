<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-300">404</h1>
      <p class="mt-4 text-gray-500">抱歉，您访问的页面不存在</p>
      <el-button class="mt-6" type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>
