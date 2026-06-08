import { defineStore } from "pinia";
import { ref } from "vue";
import { store } from "@/store";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return { count, increment };
});

/** 在组件外使用 store */
export function useCounterStoreHook() {
  return useCounterStore(store);
}
