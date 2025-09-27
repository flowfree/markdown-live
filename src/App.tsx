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
  const [markdownContent, setMarkdownContent] = useState(`# Welcome to Vim Markdown Editor

This is a **markdown editor** with Vim keybindings!

## Features
- Vim-style keybindings
- Live preview
- Split-pane interface

Try editing this text using Vim commands:
- Press \`i\` to enter insert mode
- Press \`Esc\` to return to normal mode
- Use \`h\`, \`j\`, \`k\`, \`l\` for navigation
- Use \`dd\` to delete a line
- Use \`yy\` to copy a line
- Use \`p\` to paste

Enjoy writing in Markdown!`);

  // Editor state tracking for status bar display
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [vimMode, setVimMode] = useState('normal');

  // Scroll synchronization state using percentage-based positioning
  // This ensures content alignment regardless of different pane heights
  const [editorScrollPercentage, setEditorScrollPercentage] = useState(0);
  const [previewScrollPercentage, setPreviewScrollPercentage] = useState(0);
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState(true);

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
