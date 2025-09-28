import { useState } from "react";
import Split from "react-split";
import "./App.css";
import VimEditor from "./components/VimEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import StatusBar from "./components/StatusBar";
import { ThemeProvider } from "./contexts/ThemeContext";

/**
 * Main App Component
 *
 * The root component that orchestrates the entire markdown editor application.
 * Features:
 * - Split-pane layout with resizable editor and preview
 * - Real-time markdown editing with Vim keybindings
 * - Live preview with GitHub-style rendering
 * - Scroll synchronization between panes
 * - Dark/light theme support
 * - Status bar with editor statistics
 * - Word count, cursor position, and Vim mode tracking
 */
function App() {
  // Primary application state: the markdown content being edited
  const [markdownContent, setMarkdownContent] = useState(`# Welcome to Markdown Live

Markdown Live is a modern desktop markdown editor that combines the power of **Vim keybindings** with real-time preview capabilities. Built with React and Tauri, it offers a seamless writing experience for developers, writers, and documentation enthusiasts.

## 🚀 Key Features

### Editor Experience
- **Full Vim Support**: Complete modal editing with normal, insert, visual, and command modes
- **Syntax Highlighting**: Beautiful theme-aware markdown syntax highlighting
- **Live Preview**: Real-time rendering with GitHub-flavored markdown styling
- **Split-Pane Interface**: Resizable editor and preview panes for optimal workflow
- **Scroll Synchronization**: Automatic alignment between editor and preview content

### Visual & Performance
- **Dark/Light Themes**: Seamless theme switching with system preference detection
- **Responsive Layout**: Adaptive interface that works on various screen sizes
- **Fast Rendering**: Optimized performance with efficient re-rendering
- **Desktop Native**: Cross-platform desktop application powered by Tauri

## 📝 Getting Started with Vim

If you're new to Vim, here are the essential commands to get you started:

### Basic Navigation
- \`h\` \`j\` \`k\` \`l\` - Move left, down, up, right
- \`w\` \`b\` - Jump forward/backward by word
- \`0\` \`$\` - Beginning/end of line
- \`gg\` \`G\` - Top/bottom of document

### Mode Switching
- \`i\` - Enter insert mode at cursor
- \`a\` - Enter insert mode after cursor
- \`o\` - Create new line below and enter insert mode
- \`Esc\` - Return to normal mode

### Editing Commands
- \`dd\` - Delete entire line
- \`yy\` - Copy (yank) entire line
- \`p\` - Paste below cursor
- \`u\` - Undo last change
- \`Ctrl+r\` - Redo

### Search & Replace
- \`/text\` - Search for "text"
- \`n\` \`N\` - Next/previous search result
- \`:s/old/new/g\` - Replace "old" with "new" on current line

## 📋 Markdown Syntax Guide

### Headers
\`\`\`markdown
# H1 Header
## H2 Header
### H3 Header
\`\`\`

### Text Formatting
- **Bold text** with \`**bold**\`
- *Italic text* with \`*italic*\`
- \`inline code\` with backticks
- ~~Strikethrough~~ with \`~~text~~\`

### Lists
1. Numbered lists
2. Are created like this
   - With sub-items
   - Using dashes or asterisks

### Code Blocks
\`\`\`javascript
function hello() {
  console.log("Hello, Markdown Live!");
}
\`\`\`

### Links & Images
- [Link text](https://example.com)
- ![Markdown Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/208px-Markdown-mark.svg.png)

### Tables
| Feature | Status | Notes |
|---------|--------|-------|
| Vim bindings | ✅ | Full modal editing |
| Live preview | ✅ | Real-time rendering |
| Themes | ✅ | Dark/light modes |

### Blockquotes
> "The best way to get started is to quit talking and begin doing."
>
> — Walt Disney

---

## 🎯 Pro Tips

1. **Theme Toggle**: Use the button in the status bar to switch between light and dark themes
2. **Pane Resizing**: Drag the divider between editor and preview to adjust sizes
3. **Scroll Sync**: The preview automatically follows your editor position
4. **Word Count**: Keep track of your progress with the live word counter
5. **Vim Mode**: The current Vim mode is displayed in the status bar

## 🛠 Technical Details

Markdown Live is built with modern web technologies:
- **Frontend**: React 19 + TypeScript + Vite
- **Editor**: CodeMirror 6 with Vim extension
- **Desktop**: Tauri 2 for native performance
- **Styling**: TailwindCSS for responsive design
- **Markdown**: marked.js for parsing and rendering

Start writing your content by pressing \`i\` to enter insert mode, or explore the interface to get familiar with the features. Happy writing! ✨`);

  // Editor state tracking for status bar display
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [vimMode, setVimMode] = useState('normal');

  // Scroll synchronization state using percentage-based positioning
  // This ensures content alignment regardless of different pane heights
  const [editorScrollPercentage, setEditorScrollPercentage] = useState(0);
  const [previewScrollPercentage, setPreviewScrollPercentage] = useState(0);
  const [isScrollSyncEnabled] = useState(true);

  // Calculate word count for status bar (handles empty content gracefully)
  const wordCount = markdownContent.trim() ? markdownContent.trim().split(/\s+/).length : 0;

  return (
    <ThemeProvider>
      {/* Main application container with full viewport height */}
      <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900">
        {/* Content area that takes remaining space after status bar */}
        <div className="flex-1 min-h-0">
          {/*
            Split pane layout with resizable editor and preview.
            Configuration:
            - 50/50 initial split
            - 300px minimum size for each pane
            - 2px gutter for clean appearance
            - Horizontal direction for side-by-side layout
          */}
          <Split
            sizes={[50, 50]}
            minSize={300}
            expandToMin={false}
            gutterSize={2}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
            className="h-full"
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            {/* Left pane: Markdown editor with Vim keybindings */}
            <div className="overflow-hidden bg-white dark:bg-black">
              <VimEditor
                value={markdownContent}
                onChange={setMarkdownContent}
                onCursorChange={(line, column) => setCursorPosition({ line, column })}
                onVimModeChange={setVimMode}
                onScroll={setEditorScrollPercentage}
                syncScrollTop={previewScrollPercentage}
                isScrollSyncEnabled={isScrollSyncEnabled}
              />
            </div>

            {/* Right pane: Live markdown preview */}
            <div className="overflow-hidden">
              <MarkdownPreview
                content={markdownContent}
                onScroll={setPreviewScrollPercentage}
                syncScrollTop={editorScrollPercentage}
                isScrollSyncEnabled={isScrollSyncEnabled}
              />
            </div>
          </Split>
        </div>

        {/*
          Status bar at bottom showing:
          - Word count
          - Current Vim mode
          - Cursor position (line, column)
          - Theme toggle button
        */}
        <StatusBar
          wordCount={wordCount}
          vimMode={vimMode}
          line={cursorPosition.line}
          column={cursorPosition.column}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
