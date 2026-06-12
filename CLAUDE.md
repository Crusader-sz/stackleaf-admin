# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev        # Vite dev server (HMR)
pnpm run build      # Type-check + production build
pnpm run preview    # Preview production build
pnpm run lint       # ESLint with auto-fix
pnpm run format     # Prettier
```

## Architecture

```
src/
├── main.ts                  # App entry: createApp → Pinia → Router → mount
├── App.vue                  # Root: ElConfigProvider (zh-cn) + router-view + ReDialog
├── style/
│   ├── index.css            # Tailwind entry: @theme tokens + .dark overrides + base styles
│   └── element-plus.css     # Element Plus CSS variable → design token mapping
├── router/index.ts          # Routes + beforeEach guard (auth + role check)
├── store/
│   ├── index.ts             # createPinia + setupStore()
│   ├── types.ts             # Shared TS types (userType, appType, etc.)
│   └── modules/user.ts      # User store: login/logout/refreshToken
├── utils/
│   ├── auth.ts              # Token (Cookie) + user-info (localStorage) + jwtDecode
│   ├── cookie.ts            # getCookie/setCookie/removeCookie wrapper
│   └── http/
│       ├── index.ts         # Axios instance: interceptors, token injection, refresh queue, NProgress
│       ├── types.d.ts       # PureHttpRequestConfig, PureHttpResponse, etc.
│       └── progress.ts      # NProgress config
├── composables/
│   └── useTheme.ts          # Theme state: themeMode (light|dark|system) → resolvedTheme
├── components/
│   ├── AppButton.vue        # Design-spec button (primary/secondary/destructive/ghost)
│   ├── AppInput.vue         # Design-spec input (label above, error below, password toggle)
│   ├── ThemeToggle.vue      # Light/dark toggle icon button
│   └── ReDialog/            # Reusable dialog (Element Plus wrapper)
├── layouts/
│   └── index.vue            # App shell: responsive sidebar (el-aside desktop / el-drawer mobile) + header + main
└── views/                   # Page views organised by business module
    ├── login/
    │   └── index.vue        # Login page: centered card, form validation, theme toggle
    ├── dashboard/
    │   └── index.vue        # Home page (placeholder)
    ├── system/
    │   └── user/            # User management
    │       ├── index.vue    # User list (table + search + pagination)
    │       ├── types.ts     # User VO, form data, enums
    │       └── components/
    │           └── UserDialog.vue  # Add/edit user dialog
    └── error/
        ├── 403.vue          # Forbidden page
        └── 404.vue          # Not found page
```

## Development Workflow

**After every code change**, run both before considering the task complete:

```bash
pnpm run lint && pnpm run format
```

Fix any lint errors or formatting issues before handing off.

## Key Conventions

### Path alias
`@/` resolves to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### Component philosophy
Custom base components (`AppButton`, `AppInput`) are used for design consistency. Element Plus is used for layout primitives (`el-container`, `el-menu`, `el-card`) and complex widgets. Both libraries coexist — auto-imported by `unplugin-vue-components`.

### Design system
`design.md` is the authoritative design specification. Colors, spacing, radii, shadows, typography are defined in the `@theme` block of `src/style/index.css` (concrete values for light). Dark mode overrides live in `.dark { }` in the same file. Element Plus variables are overridden in `src/style/element-plus.css` by referencing `var(--color-*)`. Components reference these tokens via `var(--color-*)` or Tailwind utility classes (`bg-primary`, `text-fg`, `rounded-md`).

### Auth flow (JWT)
Login POST `/admin/login` receives a JWT string. `jwtDecode()` extracts `{ sub, roles, exp }`. Storage is split: `Cookie authorized-token` (access + expires + refresh, server-readable), `Cookie multiple-tabs` (session-only, enables multi-tab sharing), `localStorage user-info` (username + roles, UI-readable). The router guard checks `hasMultiTabSession()` — a session cookie that survives refreshes but not browser close. Token refresh in the HTTP interceptor queues concurrent requests while a single `/refresh-token` call is in flight.

### Theme
Three modes via `useTheme()`: `"light"`, `"dark"`, `"system"`. The composable exposes `themeMode` (user choice), `resolvedTheme` (actual light/dark), and `setTheme()`/`toggleTheme()`. A FOUC-prevention script in `index.html` reads `localStorage` and applies `.dark` before first paint (logic must stay in sync with `useTheme.ts`). The `.dark` class on `<html>` triggers CSS variable overrides defined in `index.css`. `color-scheme: light` / `color-scheme: dark` is also toggled so native browser controls follow the theme.

### Pinia stores
Stores use the setup-function style (`defineStore("name", () => { ... })`). The `user` store is the primary auth store. Use `useUserStoreHook()` when accessing stores outside component setup (e.g., in axios interceptors).

### Responsive design

**Breakpoints (Tailwind v4 defaults):** `sm:640px` `md:768px` `lg:1024px` `xl:1280px`

**Layout rules:**
- Use `md` (768px) as the mobile/desktop boundary for sidebar and navigation
- On mobile (`< md`): sidebar is hidden by default, triggered via hamburger → `el-drawer`
- On desktop (`>= md`): sidebar is always visible (`hidden md:block`), with collapse toggle
- Lists/tables: wrap in `overflow-x-auto` so they scroll horizontally on narrow screens
- Search inputs: use `w-full sm:!w-64` so they fill mobile width but cap on desktop
- Pagination: simplify `layout` on mobile (drop "total" and "sizes", enable `:small`)
- Forms/cards: use responsive padding (`px-4 sm:px-6 lg:px-8`)
- Text that can wrap: avoid fixed width, use `min-w-0` on flex children to allow shrink

**Viewport meta** is set in `index.html` (`width=device-width, initial-scale=1.0`). Browser globals (`window`, `ResizeObserver`, etc.) are recognized via `globals.browser` in ESLint config. Do NOT add `/* global window, ... */` comments to Vue files.

### ESLint
Flat config. Vue files parsed by `vue-eslint-parser` with `typescript-eslint` for the `<script>` block. Unused vars that start with `_` are allowed. `vue/multi-word-component-names` is disabled. Browser globals injected via `globals` package so `window`, `ResizeObserver`, etc. are recognized.
