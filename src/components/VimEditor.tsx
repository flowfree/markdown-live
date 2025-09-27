import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { vim } from "@replit/codemirror-vim";

interface VimEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VimEditor({ value, onChange }: VimEditorProps) {
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