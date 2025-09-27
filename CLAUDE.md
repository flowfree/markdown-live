# Markdown Editor

A desktop markdown editor built with Tauri, React, and TypeScript featuring Vim-style keybindings and live preview.

## Features

- **Vim Keybindings**: Full Vim modal editing with normal, insert, and visual modes
- **Live Preview**: Real-time GitHub-style markdown rendering
- **Resizable Panes**: Adjustable split-pane interface
- **Syntax Highlighting**: Markdown syntax highlighting in the editor
- **Desktop App**: Cross-platform desktop application using Tauri
- **Auto-focus**: Editor is automatically focused on app load

## Tech Stack

- **Frontend**: React 19 + TypeScript + TailwindCSS
- **Desktop**: Tauri v2
- **Editor**: CodeMirror 6 with @replit/codemirror-vim
- **Markdown**: marked.js for parsing
- **UI**: react-split for resizable panes

## Development

### Prerequisites

- Node.js 18+
- Rust (for Tauri)

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev        # Web version at http://localhost:1420
npm run tauri dev  # Desktop application (opens maximized)
```

### Build

```bash
npm run build       # Web build
npm run tauri build # Desktop build
```

## Project Structure

```
src/
├── components/
│   ├── VimEditor.tsx          # CodeMirror editor with Vim bindings
│   └── MarkdownPreview.tsx    # Live markdown preview
├── App.tsx                    # Main app with split panes
├── App.css                    # Styling (TailwindCSS + custom)
└── main.tsx                   # React entry point

src-tauri/                     # Tauri configuration and Rust code
```

## Vim Keybindings

The editor supports standard Vim keybindings:

- **Modal editing**: `i` for insert mode, `Esc` for normal mode
- **Navigation**: `h`, `j`, `k`, `l` for cursor movement
- **Editing**: `dd` to delete line, `yy` to copy, `p` to paste
- **Visual mode**: `v` for character selection, `V` for line selection

## Configuration

### Tauri Configuration

- Window title: "Markdown Editor"
- Opens maximized by default
- Resizable panes with 300px minimum width
- Editor auto-focuses on load

### Development Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run tauri dev` - Start Tauri development app
- `npm run tauri build` - Build desktop application

## Styling

The preview pane uses GitHub-style markdown rendering with:

- GitHub's font stack and typography
- Proper heading hierarchy and spacing
- Code block styling with syntax highlighting
- Table styling with striped rows
- Blockquote and list styling matching GitHub

## Dependencies

### Main Dependencies

- `react` - UI framework
- `codemirror` - Code editor
- `@replit/codemirror-vim` - Vim keybindings
- `marked` - Markdown parser
- `react-split` - Resizable panes
- `@tauri-apps/api` - Tauri integration

### Development Dependencies

- `@vitejs/plugin-react` - React support for Vite
- `tailwindcss` - CSS framework
- `typescript` - Type checking
- `@tauri-apps/cli` - Tauri CLI tools