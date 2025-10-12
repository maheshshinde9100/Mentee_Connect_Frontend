import React, { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const CopyButton = ({ text, label = "Copy", className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        copied
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
      } ${className}`}
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4 mr-1" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
          {label}
        </>
      )}
    </button>
  );
};

export default CopyButton;