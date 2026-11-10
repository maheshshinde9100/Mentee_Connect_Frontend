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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-2 text-sm">
      <p className="muted">
        Page {currentPage} of {totalPages}
        {typeof totalElements === 'number' && (
          <span className="ml-2">
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
            className="input w-auto py-1.5"
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
          className="btn-secondary btn-sm"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || !canNext}
          className="btn-secondary btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
