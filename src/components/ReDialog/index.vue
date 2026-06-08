<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const title = ref("");
const content = ref("");

function open(dialogTitle: string, dialogContent: string) {
  title.value = dialogTitle;
  content.value = dialogContent;
  visible.value = true;
}

function close() {
  visible.value = false;
}

defineExpose({ open, close });
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="500px" destroy-on-close>
    <span>{{ content }}</span>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="close">确定</el-button>
    </template>
  </el-dialog>
</template>
