<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import UserDialog from "./components/UserDialog.vue";
import type { UserVO, UserFormData } from "./types";
import { ROLE_MAP } from "./types";

// ── Mock 数据（后端就绪后替换为 API 调用）──────────────
const mockList: UserVO[] = [
  {
    id: 1,
    username: "admin",
    nickname: "管理员",
    avatar: "",
    bio: "系统管理员",
    role: 1,
    followerCount: 128,
    followingCount: 32,
    createTime: "2025-01-15 10:30:00",
  },
  {
    id: 2,
    username: "zhangsan",
    nickname: "张三",
    avatar: "",
    bio: "前端开发工程师",
    role: 0,
    followerCount: 56,
    followingCount: 18,
    createTime: "2025-02-20 14:22:00",
  },
  {
    id: 3,
    username: "lisi",
    nickname: "李四",
    avatar: "",
    bio: "",
    role: 0,
    followerCount: 12,
    followingCount: 8,
    createTime: "2025-03-08 09:15:00",
  },
  {
    id: 4,
    username: "wangwu",
    nickname: "王五",
    avatar: "",
    bio: "后端开发",
    role: 1,
    followerCount: 89,
    followingCount: 45,
    createTime: "2025-04-12 16:48:00",
  },
  {
    id: 5,
    username: "zhaoliu",
    nickname: "赵六",
    avatar: "",
    bio: "",
    role: 0,
    followerCount: 3,
    followingCount: 5,
    createTime: "2025-05-01 08:00:00",
  },
  {
    id: 6,
    username: "sunqi",
    nickname: "孙七",
    avatar: "",
    bio: "UI 设计师",
    role: 0,
    followerCount: 34,
    followingCount: 22,
    createTime: "2025-06-03 11:11:00",
  },
];

// ── 状态 ─────────────────────────────────────────────
const list = ref<UserVO[]>([...mockList]);
const keyword = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const editingUser = ref<UserVO | null>(null);

// ── 响应式断点 ─────────────────────────────────────
const MOBILE_BREAKPOINT = 768;
const isMobile = ref(false);
function onResize() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
}
onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

// ── 过滤后的列表 ─────────────────────────────────────
const filteredList = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (!kw) return list.value;
  return list.value.filter(
    (u) => u.username.toLowerCase().includes(kw) || u.nickname.toLowerCase().includes(kw)
  );
});

// ── 新增 / 编辑 ──────────────────────────────────────
function openAdd() {
  editingUser.value = null;
  dialogVisible.value = true;
}

function openEdit(user: UserVO) {
  editingUser.value = { ...user };
  dialogVisible.value = true;
}

function handleSubmit(data: UserFormData) {
  if (data.id) {
    // 编辑：更新现有数据
    const idx = list.value.findIndex((u) => u.id === data.id);
    if (idx > -1) {
      list.value[idx] = {
        ...list.value[idx],
        nickname: data.nickname,
        role: data.role,
        // status not in UserVO, handle separately via API
      };
    }
    ElMessage.success("用户信息已更新");
  } else {
    // 新增：模拟插入
    const newUser: UserVO = {
      id: Math.max(0, ...list.value.map((u) => u.id)) + 1,
      username: data.username,
      nickname: data.nickname,
      role: data.role,
      followerCount: 0,
      followingCount: 0,
      createTime: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
    list.value.unshift(newUser);
    ElMessage.success("用户创建成功");
  }
  dialogVisible.value = false;
}

// ── 删除 ────────────────────────────────────────────
async function handleDelete(user: UserVO) {
  await ElMessageBox.confirm(`确认删除用户「${user.nickname}」吗？此操作不可恢复。`, "删除确认", {
    type: "warning",
    confirmButtonText: "删除",
    cancelButtonText: "取消",
  });
  list.value = list.value.filter((u) => u.id !== user.id);
  ElMessage.success("用户已删除");
}
</script>

<template>
  <div class="p-6">
    <!-- 顶部栏 -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-slate-800 dark:text-white">用户管理</h2>
      <el-button type="primary" @click="openAdd">新增用户</el-button>
    </div>

    <!-- 搜索 -->
    <div class="mb-4">
      <el-input
        v-model="keyword"
        placeholder="搜索用户名或昵称"
        clearable
        class="w-full sm:!w-64"
      />
    </div>

    <!-- 用户表格（小屏横向滚动） -->
    <div class="overflow-x-auto">
      <el-table v-loading="false" :data="filteredList" stripe border class="dark:!bg-slate-800">
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="username" label="用户名" min-width="110" />
        <el-table-column prop="nickname" label="昵称" min-width="110" />

        <!-- 角色列 — 用 el-tag 区分 -->
        <el-table-column label="角色" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.role === 1 ? 'danger' : ''" size="small">
              {{ ROLE_MAP[row.role as keyof typeof ROLE_MAP] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="注册时间" width="170" />

        <!-- 操作列 -->
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="flex justify-end mt-4">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredList.length"
        :page-sizes="[10, 20, 50]"
        :layout="isMobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next'"
        :small="isMobile"
        background
      />
    </div>

    <!-- 新增 / 编辑弹窗 -->
    <UserDialog
      :visible="dialogVisible"
      :user="editingUser"
      @close="dialogVisible = false"
      @submit="handleSubmit"
    />
  </div>
</template>
