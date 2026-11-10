import React from 'react';

const PageLoader = ({ fullScreen = false }) => (
  <div
    className={`flex w-full items-center justify-center bg-gray-50 dark:bg-slate-900 ${
      fullScreen ? 'min-h-screen' : 'min-h-[60vh]'
    }`}
  >
    <div
      className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400"
      role="status"
      aria-label="Loading"
    />
  </div>
);

export default PageLoader;
