# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build
- `npm run tauri` - Run Tauri commands (use with dev/build for desktop app)
- `npx tsc --noEmit` - Type check without emitting files

### Tauri Desktop App
- `npm run tauri dev` - Run in Tauri development mode (desktop app)
- `npm run tauri build` - Build desktop application

## Architecture

This is a **Tauri-based desktop markdown editor** with Vim keybindings. The app uses a split-pane interface with real-time preview and scroll synchronization.

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS with dark/light theme support
- **Editor**: CodeMirror 6 with Vim keybindings (@replit/codemirror-vim)
- **Markdown**: marked.js for parsing and rendering
- **Desktop**: Tauri 2 (Rust backend)
- **Layout**: react-split for resizable panes

### Key Components

**App.tsx** (`src/App.tsx`)
- Main orchestrator component managing application state
- Handles split-pane layout, scroll synchronization, and status tracking
- Manages markdown content, cursor position, vim mode, and word count

**VimEditor** (`src/components/VimEditor.tsx`)
- CodeMirror-based editor with full Vim modal editing
- Syntax highlighting with theme-aware colors
- Scroll synchronization using percentage-based positioning
- Real-time cursor and mode tracking

**MarkdownPreview** (`src/components/MarkdownPreview.tsx`)
- Real-time markdown rendering with GitHub-style appearance
- Scroll synchronization that aligns with editor content
- Theme-aware styling for light/dark modes

**ThemeContext** (`src/contexts/ThemeContext.tsx`)
- Centralized theme management with localStorage persistence
- Provides theme state and toggle functionality throughout the app

**StatusBar** (`src/components/StatusBar.tsx`)
- Displays word count, vim mode, cursor position, and theme toggle

### Scroll Synchronization System
The app implements **percentage-based scroll synchronization** between editor and preview panes:
- Both components track scroll position as percentage (0-1)
- Uses `isScrollingFromSync` flags to prevent infinite loops
- Accounts for different content heights in each pane

### Theme System
- Uses Tailwind's dark mode with class-based switching
- ThemeContext manages theme state and applies classes to `document.documentElement`
- CodeMirror editor has custom theme definitions for both light and dark modes
- All components support theme switching without remounting

### Tauri Integration
- Minimal Rust backend (`src-tauri/src/main.rs` and `src-tauri/src/lib.rs`)
- Uses Tauri 2 with plugin architecture
- Desktop app with web frontend architecture