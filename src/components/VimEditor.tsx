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
  onScroll?: (scrollTop: number) => void;
  syncScrollTop?: number;
  isScrollSyncEnabled?: boolean;
}

export default function VimEditor({
  value,
  onChange,
  onCursorChange,
  onVimModeChange,
  onScroll,
  syncScrollTop,
  isScrollSyncEnabled
}: VimEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { theme } = useTheme();
  const isScrollingFromSync = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;

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

    // Dark mode syntax highlighting
    const darkHighlight = HighlightStyle.define([
      { tag: tags.heading1, color: "#7dd3fc", fontWeight: "bold" },
      { tag: tags.heading2, color: "#7dd3fc", fontWeight: "bold" },
      { tag: tags.heading3, color: "#7dd3fc", fontWeight: "bold" },
      { tag: tags.heading4, color: "#7dd3fc", fontWeight: "bold" },
      { tag: tags.heading5, color: "#7dd3fc", fontWeight: "bold" },
      { tag: tags.heading6, color: "#9ca3af", fontWeight: "bold" },
      { tag: tags.strong, color: "#d1d5db", fontWeight: "bold" },
      { tag: tags.emphasis, color: "#c084fc", fontStyle: "italic" },
      { tag: tags.strikethrough, textDecoration: "line-through" },
      { tag: tags.link, color: "#60a5fa", textDecoration: "underline" },
      { tag: tags.url, color: "#60a5fa" },
      { tag: tags.monospace, color: "#fbbf24", backgroundColor: "#374151" },
      { tag: tags.quote, color: "#9ca3af", fontStyle: "italic" },
      { tag: tags.list, color: "#d1d5db" },
      { tag: tags.punctuation, color: "#d1d5db" },
      { tag: tags.content, color: "#d1d5db" },
      { tag: tags.keyword, color: "#f87171" },
      { tag: tags.string, color: "#34d399" },
      { tag: tags.comment, color: "#9ca3af", fontStyle: "italic" },
    ]);

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        markdown(),
        vim(),
        syntaxHighlighting(theme === 'dark' ? darkHighlight : lightHighlight),
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
        // Base theme
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px",
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          },
          ".cm-content": {
            padding: "16px",
            lineHeight: "1.5",
            whiteSpace: "pre-wrap",
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
          ".cm-line": {
            wordWrap: "break-word",
          },
        }),

        // Theme-specific styling
        theme === 'dark' ? EditorView.theme({
          "&": {
            backgroundColor: "#000000",
            color: "#d1d5db",
          },
          ".cm-content": {
            caretColor: "#ffffff",
          },
          ".cm-cursor, .cm-dropCursor": {
            borderLeftColor: "#ffffff",
          },
          "&.cm-focused .cm-cursor": {
            borderLeftColor: "#ffffff",
          },
          ".cm-selectionBackground, ::selection": {
            backgroundColor: "#374151",
          },
          ".cm-activeLine": {
            backgroundColor: "#2d3748",
          },
          ".cm-gutters": {
            backgroundColor: "#000000",
            color: "#9ca3af",
            border: "none",
          },
          ".cm-vim-fat-cursor": {
            backgroundColor: "#ffffff !important",
            color: "#000000 !important",
            border: "none !important",
          },
        }, { dark: true }) : EditorView.theme({
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

    // Set up scroll listener
    const handleScroll = () => {
      if (onScroll && !isScrollingFromSync.current) {
        const scrollTop = view.scrollDOM.scrollTop;
        const scrollHeight = view.scrollDOM.scrollHeight;
        const clientHeight = view.scrollDOM.clientHeight;

        // Calculate scroll percentage
        const maxScroll = scrollHeight - clientHeight;
        const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;

        onScroll(scrollPercentage);
      }
    };

    view.scrollDOM.addEventListener('scroll', handleScroll, { passive: true });

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
        view.scrollDOM.removeEventListener('scroll', handleScroll);
        view.destroy();
      };
    }

    return () => {
      view.scrollDOM.removeEventListener('scroll', handleScroll);
      view.destroy();
    };
  }, [theme, onScroll]);

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

  // Handle sync scroll from preview
  useEffect(() => {
    if (viewRef.current && syncScrollTop !== undefined && isScrollSyncEnabled) {
      isScrollingFromSync.current = true;
      const scroller = viewRef.current.scrollDOM;

      // Convert percentage back to scroll position
      const scrollHeight = scroller.scrollHeight;
      const clientHeight = scroller.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const targetScrollTop = maxScroll * syncScrollTop;

      scroller.scrollTop = targetScrollTop;
      setTimeout(() => {
        isScrollingFromSync.current = false;
      }, 100);
    }
  }, [syncScrollTop, isScrollSyncEnabled]);

  return <div ref={editorRef} className="vim-editor" />;
}