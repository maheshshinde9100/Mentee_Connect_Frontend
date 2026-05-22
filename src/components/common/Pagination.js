import React, { memo } from 'react';

/**
 * Reusable pagination controls for Spring Data Page responses.
 */
const Pagination = memo(({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  disabled = false,
}) => {
  if (!totalPages || totalPages <= 0) return null;

  const currentPage = page + 1;
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-2">
      <p className="text-sm text-gray-600 dark:text-slate-400">
        Page {currentPage} of {totalPages}
        {typeof totalElements === 'number' && (
          <span className="ml-2 text-gray-500 dark:text-slate-500">
            ({totalElements} total)
          </span>
        )}
      </p>
      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={disabled}
            className="text-sm border border-gray-300 dark:border-slate-600 rounded-md px-2 py-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            aria-label="Items per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || !canPrev}
          className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-slate-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || !canNext}
          className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-slate-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          Next
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
