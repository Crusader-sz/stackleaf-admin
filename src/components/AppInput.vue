<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    type?: "text" | "password" | "email";
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    autocomplete?: string;
  }>(),
  {
    type: "text",
    disabled: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const showPassword = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const inputType = computed(() => {
  if (props.type === "password" && showPassword.value) return "text";
  return props.type;
});

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}

function focus() {
  inputRef.value?.focus();
}

defineExpose({ focus });
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :class="[
        'text-sm font-medium font-[--font-body]',
        disabled ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200',
      ]"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        ref="inputRef"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :aria-label="label || placeholder"
        :aria-invalid="!!error"
        :class="[
          'w-full h-10 px-3 rounded-lg text-sm font-[--font-body]',
          'border transition-all duration-200',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          // Normal state
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
          // Background and text
          disabled
            ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100',
          'outline-none',
        ]"
        @input="handleInput"
      />

      <!-- Password toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :aria-label="showPassword ? '隐藏密码' : '显示密码'"
        @click="showPassword = !showPassword"
      >
        <svg
          v-if="!showPassword"
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
          />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
        <svg
          v-else
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>

    <p v-if="error" role="alert" class="text-xs text-red-500 leading-tight font-[--font-body]">
      {{ error }}
    </p>
  </div>
</template>
