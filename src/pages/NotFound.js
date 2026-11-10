import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import MenteeConnectLogo from '../MenteeConnectLogo';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <MenteeConnectLogo size="md" showText={false} />
        </div>

        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
          The page you are looking for doesn't exist or may have been moved. Check the URL or head
          back to a known page.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={() => navigate('/')} className="btn-primary">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to home
          </button>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go back
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
          >
            Sign in
          </button>
          <span className="text-gray-300 dark:text-slate-600">•</span>
          <button
            onClick={() => navigate('/contact')}
            className="font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
          >
            Contact support
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
