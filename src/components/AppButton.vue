<script setup lang="ts">
type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "default" | "small";

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    block?: boolean;
    loading?: boolean;
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    size: "default",
    block: false,
    loading: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-lg font-medium select-none',
      'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
      // Variants
      variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 shadow-sm'
        : '',
      variant === 'secondary'
        ? 'bg-transparent text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-slate-400'
        : '',
      variant === 'destructive'
        ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-sm'
        : '',
      variant === 'ghost'
        ? 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-400'
        : '',
      // Size
      size === 'default' ? 'h-10 px-4 text-sm gap-2' : '',
      size === 'small' ? 'h-8 px-3 text-xs gap-1.5' : '',
      block ? 'w-full' : '',
    ]"
    :disabled="isDisabled"
    @click="emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <slot />
  </button>
</template>
