<script setup lang="ts">
import { useCounterStore } from "@/store/modules/counter";

const counter = useCounterStore();
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-green-600">Dashboard</h1>
    <p class="mt-4 text-gray-600">Count: {{ counter.count }}</p>
    <el-button class="mt-4" type="primary" @click="counter.increment()">+1</el-button>
  </div>
</template>
