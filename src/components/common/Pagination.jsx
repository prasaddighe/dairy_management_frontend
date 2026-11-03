import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  totalItems,
  className = '',
  alwaysShow = false,
  showPageInput = true,
  id,
  testId = 'Pagination'
}) => {
  const [inputPage, setInputPage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close items-per-page dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compute visible pages with delta logic
  const visiblePages = useMemo(() => {
    if (!totalPages || totalPages < 1) return [];
    if (totalPages === 1) return [1];

    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    rangeWithDots.push(1);
    if (currentPage - delta > 2) {
      rangeWithDots.push('...');
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...');
    }

    rangeWithDots.push(totalPages);

    return Array.from(new Set(rangeWithDots));
  }, [currentPage, totalPages]);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      if (onPageChange) {
        onPageChange(page);
      }
      setInputPage('');
    }
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (/^0\d+/.test(value)) {
      value = value.replace(/^0+/, '');
    }
    if (!/^\d*$/.test(value)) return;
    const numValue = parseInt(value, 10);
    if (value === '' || (numValue <= totalPages && numValue > 0)) {
      setInputPage(value);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(inputPage, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        if (onPageChange) {
          onPageChange(pageNum);
        }
        setInputPage('');
      } else {
        setInputPage('');
      }
    }
  };

  const handleItemsPerPageChange = (option) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(option);
    }
    setIsDropdownOpen(false);
  };

  if (totalPages <= 1 && !alwaysShow && (!totalItems || totalItems <= itemsPerPage)) {
    return null;
  }

  const baseId = id || testId;

  return (
    <div
      id={baseId ? `${baseId}-container` : undefined}
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      {/* Left side: Showing count & Items per page dropdown */}
      <div className="flex items-center gap-3">
        {totalItems !== undefined && (
          <span className="text-xs text-slate-500">
            Showing{' '}
            <strong className="text-slate-700">
              {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-700">
              {Math.min(totalItems, currentPage * itemsPerPage)}
            </strong>{' '}
            of <strong className="text-slate-700">{totalItems}</strong> entries
          </span>
        )}

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-semibold rounded-[8px] transition-colors duration-200 min-w-[70px] border border-slate-200/80 cursor-pointer shadow-2xs focus:outline-none"
          >
            <span>{itemsPerPage} / page</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1 z-50 bg-white rounded-[8px] shadow-xl border border-slate-200 min-w-[95px] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
              {itemsPerPageOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleItemsPerPageChange(option)}
                  className={`w-full px-3 py-1.5 text-left text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                    itemsPerPage === option
                      ? 'bg-emerald-600 !text-white'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {option} / page
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Numbered page navigation buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-9 h-9 flex items-center justify-center rounded-[10px] text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer border border-slate-200/70 shadow-2xs"
          title="Previous Page"
        >
          <ChevronLeft size={15} />
        </button>

        <div className="flex flex-wrap items-center gap-1">
          {visiblePages.map((page, index) => (
            <span key={index} className="flex items-center">
              {page === '...' ? (
                <>
                  <span className="px-1 text-slate-400 font-bold text-xs select-none">...</span>
                  {showPageInput && index === visiblePages.lastIndexOf('...') && (
                    <input
                      type="text"
                      placeholder="Go"
                      value={inputPage}
                      title="Type page number and press Enter"
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                      className="w-9 h-9 text-center rounded-[10px] bg-emerald-600 text-white placeholder:text-emerald-200 text-xs font-bold shadow-xs outline-none focus:ring-2 focus:ring-emerald-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none mx-0.5"
                    />
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePageClick(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-[10px] text-xs font-bold transition-all duration-200 cursor-pointer ${
                    currentPage === page
                      ? 'bg-emerald-600 !text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/70 shadow-2xs'
                  }`}
                >
                  {page}
                </button>
              )}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-[10px] text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer border border-slate-200/70 shadow-2xs"
          title="Next Page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
