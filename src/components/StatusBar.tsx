import { useTheme } from '../contexts/ThemeContext';

interface StatusBarProps {
  wordCount: number;
  vimMode: string;
  line: number;
  column: number;
}

export default function StatusBar({ wordCount, vimMode, line, column }: StatusBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 text-xs">
      <div className="flex items-center gap-4">
        <span className="text-gray-600 dark:text-gray-400">
          Words: {wordCount}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          Ln {line}, Col {column}
        </span>
        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {vimMode.toUpperCase()}
        </span>
      </div>

      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-200 dark:hover:bg-gray-100 text-black text-xs font-semibold shadow-sm border-0 transition-all duration-200 hover:shadow-md"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>
    </div>
  );
}