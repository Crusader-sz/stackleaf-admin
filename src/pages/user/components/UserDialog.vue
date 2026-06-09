<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { UserVO, UserFormData, UserRole, UserStatus } from "../types";
import { ROLE_MAP, STATUS_MAP } from "../types";

const props = defineProps<{
  visible: boolean;
  /** null = 新增，非 null = 编辑 */
  user: UserVO | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: UserFormData];
}>();

const isEdit = ref(false);
const formRef = ref();

/** 初始表单 */
const emptyForm = (): UserFormData => ({
  username: "",
  password: "",
  nickname: "",
  email: "",
  role: 0,
  status: 1,
});

const form = reactive<UserFormData>(emptyForm());

// 校验规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 50, message: "用户名 2-50 字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 100, message: "密码 6-100 字符", trigger: "blur" },
  ],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
};

// 弹窗打开时重置表单
watch(
  () => props.visible,
  (val) => {
    if (!val) return;
    isEdit.value = !!props.user;
    if (props.user) {
      // 编辑态：回填数据，密码可留空（不修改）
      form.id = props.user.id;
      form.username = props.user.username;
      form.password = "";
      form.nickname = props.user.nickname;
      form.email = "";
      form.role = props.user.role;
      form.status = 1;
    } else {
      Object.assign(form, emptyForm());
    }
    formRef.value?.resetFields();
  }
);

async function handleConfirm() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  emit("submit", { ...form });
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    width="520px"
    :close-on-click-modal="false"
    @close="emit('close')"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="mt-2">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          :disabled="isEdit"
          maxlength="50"
        />
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" :prop="isEdit ? '' : 'password'">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :placeholder="isEdit ? '留空则不修改密码' : '请输入密码'"
          maxlength="100"
        />
      </el-form-item>

      <!-- 昵称 -->
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入昵称" maxlength="50" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="100" />
      </el-form-item>

      <!-- 角色 & 状态 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" class="!w-full">
              <el-option
                v-for="(label, val) in ROLE_MAP"
                :key="val"
                :label="label"
                :value="Number(val) as UserRole"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" class="!w-full">
              <el-option
                v-for="(label, val) in STATUS_MAP"
                :key="val"
                :label="label"
                :value="Number(val) as UserStatus"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="emit('close')">取消</el-button>
      <el-button type="primary" @click="handleConfirm">保存</el-button>
    </template>
  </el-dialog>
</template>
