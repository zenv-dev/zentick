# Zentick Development Guide

## Tech Stack
Vue 3, TypeScript, Tailwind CSS 4, Vite 7

## Dev Commands
- `npm install` — install deps
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run type-check` — check types

## Architecture
- `useRobustTimer` — background-safe timer (Page Visibility API)
- `useTheme` — theme management (light/dark/system)
- Composables pattern for reusable logic

## Code Style
- TypeScript strict mode
- Vue 3 Composition API with `<script setup>`
- Single responsibility per component