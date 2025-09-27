import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { vim, getCM } from "@replit/codemirror-vim";

interface VimEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange?: (line: number, column: number) => void;
  onVimModeChange?: (mode: string) => void;
}

export default function VimEditor({ value, onChange, onCursorChange, onVimModeChange }: VimEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        markdown(),
        vim(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }

          // Track cursor position
          if (update.selectionSet && onCursorChange) {
            const pos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(pos);
            onCursorChange(line.number, pos - line.from + 1);
          }

          // Track vim mode
          if (onVimModeChange) {
            try {
              const cm = getCM(update.view);
              if (cm && cm.state && cm.state.vim) {
                const mode = cm.state.vim.mode || 'normal';
                onVimModeChange(mode);
              }
            } catch (e) {
              // Fallback if vim state is not available
            }
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px",
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          },
          ".cm-content": {
            padding: "16px",
            lineHeight: "1.5",
          },
          ".cm-editor": {
            height: "100%",
          },
          ".cm-scroller": {
            height: "100%",
          },
          ".cm-focused": {
            outline: "none",
          },
          ".cm-vim-fat-cursor": {
            backgroundColor: "black !important",
            border: "none !important",
          },
          ".cm-cursor, .cm-dropCursor": {
            borderLeftColor: "black",
          },
          "&.cm-focused .cm-cursor": {
            borderLeftColor: "black",
          },
          ".cm-line ::selection": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
          ".cm-vim-fat-cursor::selection": {
            backgroundColor: "black !important",
            color: "white !important",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // Focus the editor on mount
    view.focus();

    // Set up vim mode tracking
    if (onVimModeChange) {
      const checkVimMode = () => {
        try {
          const cm = getCM(view);
          if (cm && cm.state && cm.state.vim) {
            const mode = cm.state.vim.mode || 'normal';
            onVimModeChange(mode);
          }
        } catch (e) {
          // Fallback
        }
      };

      // Check initial mode
      setTimeout(checkVimMode, 100);

      // Set up periodic checking
      const interval = setInterval(checkVimMode, 100);

      return () => {
        clearInterval(interval);
        view.destroy();
      };
    }

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return <div ref={editorRef} className="vim-editor" />;
}