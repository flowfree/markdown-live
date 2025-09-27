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
    <div className="status-bar flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 text-xs">
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
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>
    </div>
  );
}