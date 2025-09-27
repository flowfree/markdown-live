import { useState } from "react";
import Split from "react-split";
import "./App.css";
import VimEditor from "./components/VimEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import StatusBar from "./components/StatusBar";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
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

  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [vimMode, setVimMode] = useState('normal');
  const [editorScrollPercentage, setEditorScrollPercentage] = useState(0);
  const [previewScrollPercentage, setPreviewScrollPercentage] = useState(0);
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState(true);

  const wordCount = markdownContent.trim() ? markdownContent.trim().split(/\s+/).length : 0;

  return (
    <ThemeProvider>
      <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900">
        <div className="flex-1 min-h-0">
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
