import { useEffect, useState } from "react";
import { marked } from "marked";

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [html, setHtml] = useState("");

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

  return (
    <div className="h-full p-6 bg-white dark:bg-black">
      <div
        className="preview-content max-w-none bg-white dark:bg-black"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}