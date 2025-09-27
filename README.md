# Markdown Editor

A modern desktop markdown editor built with Tauri, React, and Vim keybindings. Features a clean split-pane interface with real-time preview and synchronized scrolling.

## Features

- **Vim Keybindings**: Full modal editing with CodeMirror Vim support
- **Real-time Preview**: Live markdown rendering with GitHub-style appearance
- **Dark/Light Theme**: System-aware theming with manual toggle
- **Desktop Application**: Cross-platform desktop app powered by Tauri
- **Syntax Highlighting**: Theme-aware markdown syntax highlighting

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Desktop**: Tauri 2 (Rust backend)
- **Editor**: CodeMirror 6 with Vim keybindings
- **Styling**: TailwindCSS
- **Markdown**: marked.js

## Installation

### Prerequisites

- Node.js (v18 or higher)
- Rust (for Tauri desktop builds)

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd markdown-editor

# Install dependencies
npm install

# Start development server (web)
npm run dev

# Start desktop development mode
npm run tauri dev
```

## Usage

### Development Commands

```bash
# Web development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Desktop application
npm run tauri dev    # Run desktop app in development
npm run tauri build  # Build desktop application

# Type checking
npx tsc --noEmit     # Check TypeScript types
```

### Vim Keybindings

The editor supports full Vim modal editing:

- **Normal Mode**: Navigation and commands
- **Insert Mode**: Text editing
- **Visual Mode**: Text selection
- **Command Mode**: Ex commands

Standard Vim navigation (`h`, `j`, `k`, `l`), editing (`i`, `a`, `o`, etc.), and commands (`:w`, `:q`, etc.) are supported.

## Building for Production

### Web Build
```bash
npm run build
npm run preview
```

### Desktop Build
```bash
npm run tauri build
```

The desktop application will be built for your current platform and available in `src-tauri/target/release/bundle/`.

## License

MIT