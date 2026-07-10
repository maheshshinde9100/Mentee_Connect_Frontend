import React from 'react';

const PageLoader = ({ fullScreen = false }) => (
  <div
    className={`flex items-center justify-center w-full bg-slate-50 dark:bg-slate-900 ${
      fullScreen ? 'min-h-screen' : 'min-h-[60vh]'
    }`}
  >
    <div
      className="h-10 w-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"
      role="status"
      aria-label="Loading"
    />
  </div>
);

export default PageLoader;
