import { useState } from "react";
import Split from "react-split";
import "./App.css";
import VimEditor from "./components/VimEditor";
import MarkdownPreview from "./components/MarkdownPreview";

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

  return (
    <div className="h-screen w-screen flex flex-col">
      <Split
        sizes={[50, 50]}
        minSize={300}
        expandToMin={false}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        className="flex h-full"
      >
        <div className="overflow-hidden">
          <VimEditor
            value={markdownContent}
            onChange={setMarkdownContent}
          />
        </div>
        <div className="overflow-auto bg-white">
          <MarkdownPreview content={markdownContent} />
        </div>
      </Split>
    </div>
  );
}

export default App;
