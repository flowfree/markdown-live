import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { vim, getCM } from "@replit/codemirror-vim";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { useTheme } from "../contexts/ThemeContext";

interface VimEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange?: (line: number, column: number) => void;
  onVimModeChange?: (mode: string) => void;
}

export default function VimEditor({ value, onChange, onCursorChange, onVimModeChange }: VimEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!editorRef.current) return;

    // Monokai syntax highlighting (dark mode)
    const monokaiHighlight = HighlightStyle.define([
      { tag: tags.heading1, color: "#a6e22e", fontWeight: "bold" },
      { tag: tags.heading2, color: "#a6e22e", fontWeight: "bold" },
      { tag: tags.heading3, color: "#a6e22e", fontWeight: "bold" },
      { tag: tags.heading4, color: "#a6e22e", fontWeight: "bold" },
      { tag: tags.heading5, color: "#a6e22e", fontWeight: "bold" },
      { tag: tags.heading6, color: "#a6e22e", fontWeight: "bold" },
      { tag: tags.strong, color: "#f92672", fontWeight: "bold" },
      { tag: tags.emphasis, color: "#ae81ff", fontStyle: "italic" },
      { tag: tags.strikethrough, textDecoration: "line-through" },
      { tag: tags.link, color: "#66d9ef", textDecoration: "underline" },
      { tag: tags.url, color: "#66d9ef" },
      { tag: tags.monospace, color: "#e6db74", backgroundColor: "#3e3d32" },
      { tag: tags.quote, color: "#75715e", fontStyle: "italic" },
      { tag: tags.list, color: "#f8f8f2" },
      { tag: tags.punctuation, color: "#f8f8f2" },
      { tag: tags.content, color: "#f8f8f2" },
      { tag: tags.keyword, color: "#f92672" },
      { tag: tags.string, color: "#e6db74" },
      { tag: tags.comment, color: "#75715e", fontStyle: "italic" },
    ]);

    // Light mode syntax highlighting
    const lightHighlight = HighlightStyle.define([
      { tag: tags.heading1, color: "#0969da", fontWeight: "bold" },
      { tag: tags.heading2, color: "#0969da", fontWeight: "bold" },
      { tag: tags.heading3, color: "#0969da", fontWeight: "bold" },
      { tag: tags.heading4, color: "#0969da", fontWeight: "bold" },
      { tag: tags.heading5, color: "#0969da", fontWeight: "bold" },
      { tag: tags.heading6, color: "#656d76", fontWeight: "bold" },
      { tag: tags.strong, color: "#1f2328", fontWeight: "bold" },
      { tag: tags.emphasis, color: "#8250df", fontStyle: "italic" },
      { tag: tags.strikethrough, textDecoration: "line-through" },
      { tag: tags.link, color: "#0969da", textDecoration: "underline" },
      { tag: tags.url, color: "#0969da" },
      { tag: tags.monospace, color: "#0550ae", backgroundColor: "#f6f8fa" },
      { tag: tags.quote, color: "#656d76", fontStyle: "italic" },
      { tag: tags.list, color: "#1f2328" },
      { tag: tags.punctuation, color: "#1f2328" },
      { tag: tags.content, color: "#1f2328" },
      { tag: tags.keyword, color: "#cf222e" },
      { tag: tags.string, color: "#0a3069" },
      { tag: tags.comment, color: "#656d76", fontStyle: "italic" },
    ]);

    const baseTheme = EditorView.theme({
      "&": {
        height: "100%",
        fontSize: "14px",
        fontFamily: "Monaco, monospace",
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
    });

    const lightTheme = EditorView.theme({
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
    });

    const darkTheme = EditorView.theme({
      "&": {
        backgroundColor: "#272822",
        color: "#f8f8f2",
      },
      ".cm-content": {
        caretColor: "#f8f8f0",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "#f8f8f0",
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: "#f8f8f0",
      },
      ".cm-selectionBackground, ::selection": {
        backgroundColor: "#49483e",
      },
      ".cm-activeLine": {
        backgroundColor: "#3e3d32",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "#3e3d32",
      },
      ".cm-gutters": {
        backgroundColor: "#272822",
        color: "#90908a",
        border: "none",
      },
      ".cm-vim-fat-cursor": {
        backgroundColor: "#f8f8f0 !important",
        color: "#272822 !important",
        border: "none !important",
      },
      ".cm-lineNumbers": {
        color: "#90908a",
      },
    }, { dark: true });

    const vimExtension = vim({
      statusBar: false
    });

    const extensions = [
      basicSetup,
      markdown(),
      vimExtension,
      syntaxHighlighting(theme === 'dark' ? monokaiHighlight : lightHighlight),
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
      baseTheme,
      theme === 'dark' ? darkTheme : lightTheme,
    ];

    const state = EditorState.create({
      doc: value,
      extensions,
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
  }, [theme]);

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