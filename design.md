# StackLeaf Admin — Design Specification

> 现代简约风格后台管理系统设计规范，约束配色、排版、组件样式与交互行为。
> 支持亮色/暗色双模式，基于 Vue 3 + Tailwind CSS 4 + Element Plus。

---

## 1. 设计原则

| 原则 | 说明 |
|------|------|
| **内容优先** | 装饰服务于内容，不为了"好看"牺牲可读性与信息密度 |
| **克制** | 每屏只有一个主操作（Primary CTA），次要操作视觉降级 |
| **一致性** | 色彩、间距、圆角、阴影、动效全部通过 Token 统一 |
| **可访问** | WCAG AA 最低标准，文字对比度 ≥ 4.5:1，焦点可见 |
| **响应式** | 移动端 → 平板 → 桌面，断点语义化 |

---

## 2. 色彩系统

### 2.1 亮色模式 (Light)

| Token | 色值 | Tailwind | 用途 |
|-------|------|----------|------|
| `--color-primary` | `#2563EB` | `blue-600` | 主按钮、链接、选中态 |
| `--color-primary-hover` | `#1D4ED8` | `blue-700` | 主按钮悬停 |
| `--color-primary-light` | `#EFF6FF` | `blue-50` | 主色浅底 |
| `--color-secondary` | `#3B82F6` | `blue-500` | 次要元素 |
| `--color-accent` | `#EA580C` | `orange-600` | CTA 强调（谨慎使用） |
| `--color-bg` | `#F8FAFC` | `slate-50` | 页面背景 |
| `--color-bg-elevated` | `#FFFFFF` | `white` | 卡片、表格、 elevated 表面 |
| `--color-fg` | `#1E293B` | `slate-800` | 正文文字 |
| `--color-fg-secondary` | `#64748B` | `slate-500` | 辅助文字、描述 |
| `--color-fg-tertiary` | `#94A3B8` | `slate-400` | 占位符、禁用文字 |
| `--color-muted` | `#F1F5F9` | `slate-100` |  muted 背景 |
| `--color-muted-fg` | `#64748B` | `slate-500` | muted 上文字 |
| `--color-border` | `#E2E8F0` | `slate-200` | 边框、分割线 |
| `--color-border-hover` | `#CBD5E1` | `slate-300` | 边框悬停 |
| `--color-destructive` | `#DC2626` | `red-600` | 删除、危险操作 |
| `--color-success` | `#16A34A` | `green-600` | 成功状态 |
| `--color-warning` | `#F59E0B` | `amber-500` | 警告状态 |
| `--color-ring` | `#2563EB` | `blue-600` | 焦点环 |

### 2.2 暗色模式 (Dark)

| Token | 色值 | Tailwind | 用途 |
|-------|------|----------|------|
| `--color-primary` | `#3B82F6` | `blue-500` | 主按钮、链接、选中态 |
| `--color-primary-hover` | `#60A5FA` | `blue-400` | 主按钮悬停 |
| `--color-primary-light` | `#1E3A5F` | — | 主色浅底 |
| `--color-secondary` | `#60A5FA` | `blue-400` | 次要元素 |
| `--color-accent` | `#F97316` | `orange-500` | CTA 强调 |
| `--color-bg` | `#0F172A` | `slate-900` | 页面背景 |
| `--color-bg-elevated` | `#1E293B` | `slate-800` | 卡片、表格、 elevated 表面 |
| `--color-fg` | `#F1F5F9` | `slate-100` | 正文文字 |
| `--color-fg-secondary` | `#94A3B8` | `slate-400` | 辅助文字、描述 |
| `--color-fg-tertiary` | `#64748B` | `slate-500` | 占位符、禁用文字 |
| `--color-muted` | `#1E293B` | `slate-800` | muted 背景 |
| `--color-muted-fg` | `#94A3B8` | `slate-400` | muted 上文字 |
| `--color-border` | `#334155` | `slate-700` | 边框、分割线 |
| `--color-border-hover` | `#475569` | `slate-600` | 边框悬停 |
| `--color-destructive` | `#EF4444` | `red-500` | 删除、危险操作 |
| `--color-success` | `#22C55E` | `green-500` | 成功状态 |
| `--color-warning` | `#FBBF24` | `amber-400` | 警告状态 |
| `--color-ring` | `#3B82F6` | `blue-500` | 焦点环 |

### 2.3 侧边栏（独立配色）

侧边栏在亮/暗模式下均使用深色背景，与主内容区区分。

| Token | 亮色模式 | 暗色模式 |
|-------|---------|---------|
| 背景 | `#1E293B` (slate-800) | `#0F172A` (slate-900) |
| 文字 | `#CBD5E1` (slate-300) | `#94A3B8` (slate-400) |
| 选中/悬停 | `#2563EB` (blue-600) | `#3B82F6` (blue-500) |
| 选中背景 | `rgba(37, 99, 235, 0.15)` | `rgba(59, 130, 246, 0.15)` |

---

## 3. 字体与排版

### 3.1 字体族

| 角色 | 字体 | 备选 | 适用 |
|------|------|------|------|
| 标题 | **Fira Code** | `monospace` | 页面标题、卡片标题 |
| 正文 | **Fira Sans** | `system-ui, -apple-system, sans-serif` | 正文、表单、表格 |
| 数据 | **Fira Code** | `monospace` | 数字、统计、代码、表格数据列 |
| 等宽 | **Fira Code** | `Consolas, monospace` | 代码块 |

**Google Fonts 引入：**
```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
```

### 3.2 字号层级

| Token | 字号 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| `text-xs` | 12px | 1.5 | 400 | 标签、徽标、辅助信息 |
| `text-sm` | 14px | 1.5 | 400 | 表格内容、描述文字、侧边栏 |
| `text-base` | 16px | 1.6 | 400 | 正文、表单项 |
| `text-lg` | 18px | 1.5 | 500 | 卡片标题、强调文字 |
| `text-xl` | 20px | 1.4 | 600 | 小标题 |
| `text-2xl` | 24px | 1.3 | 600 | 页面标题 |
| `text-3xl` | 30px | 1.2 | 700 | 大标题 |
| `text-4xl` | 36px | 1.1 | 700 | Hero/登录页标题 |

### 3.3 排版规则

- 正文行高 ≥ 1.5，标题行高 1.1–1.4
- 每行文字控制在 60–75 字符（桌面端）
- 表格内数字使用等宽字体、右对齐
- 禁止 12px 以下的正文字号

---

## 4. 间距系统

基于 **4px 基准单位**，所有间距必须是 4 的倍数。

| Token | 值 | Tailwind | 用途 |
|-------|-----|----------|------|
| `space-1` | 4px | `p-1` / `gap-1` | 极小间距 |
| `space-2` | 8px | `p-2` / `gap-2` | 图标间距、行内间距、标签间距 |
| `space-3` | 12px | `p-3` / `gap-3` | 紧凑间距 |
| `space-4` | 16px | `p-4` / `gap-4` | 标准内边距、卡片 padding |
| `space-6` | 24px | `p-6` / `gap-6` | 区块内边距、表单间距 |
| `space-8` | 32px | `p-8` / `gap-8` | 区块间距 |
| `space-12` | 48px | `p-12` / `gap-12` | 大区块间距 |
| `space-16` | 64px | `p-16` / `gap-16` | 页面级间距 |

---

## 5. 圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `radius-sm` | 4px | 标签、徽标、小按钮 |
| `radius-md` | 8px | 按钮、输入框、下拉菜单 |
| `radius-lg` | 12px | 卡片、模态框、表格 |
| `radius-full` | 9999px | 头像、药丸标签、圆形按钮 |

---

## 6. 阴影

### 6.1 亮色模式

| Token | 值 | 用途 |
|-------|-----|------|
| `shadow-none` | `none` | 平坦元素 |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | 轻微抬起 |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)` | 卡片 |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)` | 下拉菜单、弹出层 |
| `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.04)` | 模态框 |

### 6.2 暗色模式

| Token | 值 | 用途 |
|-------|-----|------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | 轻微抬起 |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3)` | 卡片 |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.3)` | 下拉菜单 |
| `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.6), 0 8px 10px -6px rgba(0,0,0,0.3)` | 模态框 |

---

## 7. 动效

| 属性 | 值 | 说明 |
|------|-----|------|
| 微交互时长 | 150–200ms | 按钮悬停、图标变色、焦点切换 |
| 标准过渡时长 | 200–300ms | 卡片悬停、展开/收起、状态切 |
| 模态框/抽屉时长 | 250–350ms | 弹出、滑入 |
| 缓动（进入） | `cubic-bezier(0, 0, 0.2, 1)` | ease-out |
| 缓动（退出） | `cubic-bezier(0.4, 0, 1, 1)` | ease-in |
| 过渡属性 | `transition: all 200ms ease` | 通用过渡 |

**规则：**
- 仅对 `transform` 和 `opacity` 做动画，禁止动画 `width`/`height`/`top`/`left`
- 退出动画时长为进入的 60–70%
- 必须尊重 `prefers-reduced-motion`，此时禁用所有非必要动画
- 页面加载使用骨架屏，不使用 spinner（超过 300ms 的加载）

---

## 8. 布局规范

### 8.1 整体结构

```
┌──────────────────────────────────────┐
│  Sidebar  │  Header                  │
│  (深色)   ├──────────────────────────┤
│           │                          │
│  width:   │  Content Area            │
│  240px    │  (bg: --color-bg)        │
│           │                          │
│ collapsed │  max-width: 1280px       │
│ 64px      │  padding: 24px           │
│           │                          │
└───────────┴──────────────────────────┘
```

### 8.2 侧边栏

| 属性 | 值 |
|------|-----|
| 展开宽度 | 240px |
| 收起宽度 | 64px |
| 背景 | 深色（独立于主题） |
| 菜单项高度 | 48px |
| 菜单项间距 | 2px |
| 图标大小 | 20px × 20px |
| 圆角 | 8px |
| 展开/收起过渡 | 250ms ease-out |

### 8.3 顶部导航

| 属性 | 值 |
|------|-----|
| 高度 | 56px |
| 背景 | `--color-bg-elevated` |
| 底部边框 | `1px solid --color-border` |
| 内边距 | 0 24px |

### 8.4 内容区

| 属性 | 值 |
|------|-----|
| 最大宽度 | 1280px |
| 内边距 | 24px |
| 内容区最小高度 | `calc(100vh - 56px)` |

### 8.5 响应式断点

| 断点 | 宽度 | 布局变化 |
|------|------|---------|
| `sm` | 640px+ | 表格横向滚动 |
| `md` | 768px+ | 侧边栏可折叠 |
| `lg` | 1024px+ | 侧边栏默认展开 |
| `xl` | 1280px+ | 内容区最大宽度生效 |
| `2xl` | 1536px+ | 内容区居中 |

---

## 9. 组件规范

### 9.1 按钮

| 变体 | 背景 | 文字色 | 边框 | 悬停 |
|------|------|--------|------|------|
| Primary | `--color-primary` | `white` | 无 | 背景变深 10% |
| Secondary | `transparent` | `--color-fg` | `--color-border` | 背景 `--color-muted` |
| Destructive | `--color-destructive` | `white` | 无 | 背景变深 10% |
| Ghost | `transparent` | `--color-fg-secondary` | 无 | 背景 `--color-muted` |

- 最小高度：40px
- 最小宽度（仅图标按钮）：40px
- 内边距：8px 16px（默认），6px 12px（small）
- 圆角：8px
- 字重：500
- 字号：14px
- 加载态：按钮禁用 + 旋转图标替代文字

### 9.2 输入框

- 最小高度：40px
- 内边距：8px 12px
- 圆角：8px
- 边框：`1px solid --color-border`
- 聚焦：边框 `--color-primary`，外发光 `0 0 0 3px` 主色 20% 透明度
- 错误态：边框 `--color-destructive`
- 禁用态：背景 `--color-muted`，文字 `--color-fg-tertiary`，cursor `not-allowed`
- 标签必须在输入框上方（不使用 placeholder-only）

### 9.3 表格

- 表头背景：`--color-muted`
- 表头文字：`--color-fg-secondary`，字重 500，字号 13px
- 单元格内边距：12px 16px
- 行分割线：`1px solid --color-border`
- 悬停行背景：`--color-primary-light` (opacity 0.4)
- 选中行背景：`--color-primary-light`
- 数字列右对齐、等宽字体
- 空状态：居中显示"暂无数据" + 操作引导

### 9.4 卡片

- 背景：`--color-bg-elevated`
- 圆角：12px
- 阴影：`shadow-md`
- 内边距：24px
- 卡片间距：16px
- 悬停：阴影升至 `shadow-lg`，不上移（避免布局偏移）

### 9.5 模态框

- 遮罩：`rgba(0, 0, 0, 0.5)`
- 圆角：16px
- 内边距：32px
- 最大宽度：520px
- 宽度：90vw
- 关闭方式：右上角 X 按钮 + 点击遮罩 + Esc 键

### 9.6 标签/徽标

| 变体 | 背景 | 文字 |
|------|------|------|
| Default | `--color-muted` | `--color-muted-fg` |
| Primary | `--color-primary-light` | `--color-primary` |
| Success | `#DCFCE7` (亮) / `#14532D` (暗) | 对应绿 |
| Warning | `#FEF3C7` (亮) / `#713F12` (暗) | 对应琥珀 |
| Destructive | `#FEE2E2` (亮) / `#7F1D1D` (暗) | 对应红 |

- 圆角：4px 或 full（药丸形）
- 内边距：2px 8px
- 字号：12px
- 字重：500

---

## 10. 图标

- **图标库：** Element Plus Icons（`@element-plus/icons-vue`）
- 禁止使用 Emoji 作为结构性图标
- 侧边栏菜单图标：20px × 20px
- 按钮内图标：16px × 16px
- 图标颜色继承文字色，保持一致性

---

## 11. 主题切换

- 默认跟随系统主题（`prefers-color-scheme`）
- 用户手动切换后存入 `localStorage`，下次访问优先读取
- 切换过渡：`background-color 300ms ease, color 300ms ease, border-color 300ms ease`
- 使用 Tailwind CSS 4 的 `dark:` 变体 + CSS 自定义属性双轨制
- Element Plus 通过 CSS 变量覆写，与 Tailwind 暗色同步

---

## 12. 禁止事项

- ❌ Emoji 作为图标
- ❌ 纯 placeholder 作为输入框标签
- ❌ `width`/`height`/`top`/`left` 动画（应使用 `transform`）
- ❌ 动画时长超过 500ms
- ❌ 文字对比度低于 4.5:1
- ❌ 移除或隐藏焦点环（`:focus-visible` 必须有可见样式）
- ❌ 仅用颜色传达信息（需配合图标或文字）
- ❌ 水平滚动（移动端）
- ❌ 混用不同图标库
- ❌ 无意义的装饰动画（每个动画必须有因果含义）
- ❌ 超过 5 项的底部导航
- ❌ 模态框中嵌套导航流程

---

## 13. 交付前检查清单

- [ ] 亮色/暗色模式均已验证
- [ ] 文字对比度 ≥ 4.5:1（两种模式）
- [ ] 焦点环可见且清晰
- [ ] 所有交互元素有 `cursor:pointer`
- [ ] 悬停/按下/禁用状态视觉可区分
- [ ] 触摸目标 ≥ 44×44px
- [ ] `prefers-reduced-motion` 已适配
- [ ] 375px / 768px / 1024px / 1440px 均已测试
- [ ] 无水平溢出
- [ ] 无 Emoji 图标
- [ ] 动效时长 150–300ms
