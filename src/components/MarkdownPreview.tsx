import { useEffect, useState, useRef } from "react";
import { marked } from "marked";

interface MarkdownPreviewProps {
  content: string;
  onScroll?: (scrollTop: number) => void;
  syncScrollTop?: number;
  isScrollSyncEnabled?: boolean;
}

export default function MarkdownPreview({
  content,
  onScroll,
  syncScrollTop,
  isScrollSyncEnabled
}: MarkdownPreviewProps) {
  const [html, setHtml] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingFromSync = useRef(false);

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const parsed = await marked.parse(content);
        setHtml(parsed);
      } catch (error) {
        console.error("Error parsing markdown:", error);
        setHtml("<p>Error parsing markdown</p>");
      }
    };

    parseMarkdown();
  }, [content]);

  // Handle scroll events
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (onScroll && !isScrollingFromSync.current) {
      const scrollTop = e.currentTarget.scrollTop;
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;

      // Calculate scroll percentage
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;

      onScroll(scrollPercentage);
    }
  };

  // Handle sync scroll from editor
  useEffect(() => {
    if (containerRef.current && syncScrollTop !== undefined && isScrollSyncEnabled) {
      isScrollingFromSync.current = true;

      // Convert percentage back to scroll position
      const scrollHeight = containerRef.current.scrollHeight;
      const clientHeight = containerRef.current.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const targetScrollTop = maxScroll * syncScrollTop;

      containerRef.current.scrollTop = targetScrollTop;
      setTimeout(() => {
        isScrollingFromSync.current = false;
      }, 100);
    }
  }, [syncScrollTop, isScrollSyncEnabled]);

  return (
    <div
      ref={containerRef}
      className="h-full p-6 bg-white dark:bg-black overflow-auto"
      onScroll={handleScroll}
    >
      <div
        className="preview-content max-w-none text-gray-900 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}