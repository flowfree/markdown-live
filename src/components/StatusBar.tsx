interface StatusBarProps {
  wordCount: number;
  vimMode: string;
  line: number;
  column: number;
}

export default function StatusBar({ wordCount, vimMode, line, column }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-t border-gray-300 text-xs">
      <div className="flex items-center gap-4">
        <span className="text-gray-600">
          Words: {wordCount}
        </span>
        <span className="text-gray-600">
          Ln {line}, Col {column}
        </span>
        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {vimMode.toUpperCase()}
        </span>
      </div>
    </div>
  );
}