<script setup lang="ts">
/* global window, ResizeObserver */
import { ref, onMounted, onUnmounted, watch, shallowRef } from "vue";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  GraphicComponent,
} from "echarts/components";
import { useTheme } from "@/composables/useTheme";

// ── Register only needed modules (tree-shaking) ──────────
echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent,
  GraphicComponent,
]);

const props = withDefaults(
  defineProps<{
    options: echarts.EChartsCoreOption;
    height?: string;
    loading?: boolean;
  }>(),
  {
    height: "400px",
  }
);

const emit = defineEmits<{
  ready: [instance: echarts.ECharts];
}>();

const { resolvedTheme } = useTheme();
const containerRef = ref<HTMLDivElement>();
const instance = shallowRef<echarts.ECharts | null>(null);

function initChart() {
  if (!containerRef.value) return;
  instance.value = echarts.init(containerRef.value, resolvedTheme.value);
  instance.value.setOption(props.options, true);
  emit("ready", instance.value);
}

function updateOptions() {
  if (!instance.value) return;
  instance.value.setOption(props.options, true);
}

function onResize() {
  instance.value?.resize();
}

// Watch options changes
watch(() => props.options, updateOptions, { deep: true });

// Watch loading
watch(
  () => props.loading,
  (val) => {
    if (val) {
      instance.value?.showLoading();
    } else {
      instance.value?.hideLoading();
    }
  }
);

// Watch theme change → recreate with correct theme
watch(resolvedTheme, () => {
  if (instance.value) {
    instance.value.dispose();
    initChart();
  }
});

// Observe container resize
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  initChart();
  window.addEventListener("resize", onResize);
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  resizeObserver?.disconnect();
  instance.value?.dispose();
});

defineExpose({
  getInstance: () => instance.value,
  resize: onResize,
});
</script>

<template>
  <div ref="containerRef" :style="{ width: '100%', height }" class="app-chart" />
</template>

<style scoped>
.app-chart {
  min-height: 200px;
}
</style>
