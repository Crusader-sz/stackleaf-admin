/**
 * Design-system chart color palette
 * Accessible, colorblind-safe, matches design.md tokens
 */
const LIGHT_PALETTE = [
  "#2563EB", // primary
  "#EA580C", // accent
  "#16A34A", // success
  "#F59E0B", // warning
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#DC2626", // destructive
  "#64748B", // muted-fg
];

const DARK_PALETTE = [
  "#3B82F6", // primary
  "#F97316", // accent
  "#22C55E", // success
  "#FBBF24", // warning
  "#A78BFA", // violet
  "#22D3EE", // cyan
  "#EF4444", // destructive
  "#94A3B8", // muted-fg
];

export function useChartColors(isDark: () => boolean) {
  function getPalette(): string[] {
    return isDark() ? DARK_PALETTE : LIGHT_PALETTE;
  }

  /** 生成 ECharts color 配置 */
  function echartsColors(): string[] {
    return [...getPalette()];
  }

  /** 根据索引取色（循环） */
  function getColor(index: number): string {
    const p = getPalette();
    return p[index % p.length];
  }

  return { getPalette, echartsColors, getColor };
}
