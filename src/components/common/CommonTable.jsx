import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Download,
  Rows2,
  Rows3,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  Printer,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { cn } from '../../utils/cn';

export const CommonTable = ({
  columns = [],
  data = [],
  loading = false,
  skeletonRows = 6,
  title,
  subtitle,
  // Selection
  showCheckbox = false,
  selectedItems = [],
  onSelectionChange,
  keyExtractor = (item, idx) => item?.id || idx,
  bulkActionNode,
  // Search & Filtering
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchValue,
  onSearchChange,
  // Density & View
  defaultDense = false,
  densityToggle = true,
  // Export
  exportFormats = ['csv'],
  onExport,
  exporting = false,
  extraToolbar,
  // Pagination
  pagination = true,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  // Empty State
  emptyTitle = 'No records found',
  emptyMessage = 'No matching entries found for current filters.',
  onEmptyReset,
  // Styling
  className = '',
  tableClassName = '',
  onRowClick,
  rowClassName,
  maxBodyHeight
}) => {
  const [dense, setDense] = useState(defaultDense);
  const [exportOpen, setExportOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [sort, setSort] = useState(null); // { key: string, dir: 'asc' | 'desc' }
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const exportDropdownRef = useRef(null);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effective search value
  const activeSearch = searchValue !== undefined ? searchValue : localSearch;
  const handleSearchInput = (val) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setLocalSearch(val);
      setCurrentPage(1);
    }
  };

  // Filter data if internal search is used
  const filteredData = useMemo(() => {
    if (searchValue !== undefined || !activeSearch) return data;
    const q = activeSearch.toLowerCase().trim();
    return data.filter(item => {
      return Object.values(item).some(val => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [data, activeSearch, searchValue]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sort) return filteredData;
    const col = columns.find(c => c.key === sort.key || c.id === sort.key);
    if (!col) return filteredData;

    return [...filteredData].sort((a, b) => {
      let av = col.sortValue ? col.sortValue(a) : (col.field ? a[col.field] : a[col.key || col.id]);
      let bv = col.sortValue ? col.sortValue(b) : (col.field ? b[col.field] : b[col.key || col.id]);

      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;

      const numA = Number(av);
      const numB = Number(bv);
      const isNum = !isNaN(numA) && !isNaN(numB) && typeof av !== 'boolean';

      const cmp = isNum ? numA - numB : String(av).localeCompare(String(bv));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sort, columns]);

  // Pagination calculation
  const totalItems = sortedData.length;
  const totalPages = pagination ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (safePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, safePage, pageSize]);

  // Column Sort Toggle
  const handleSort = (col) => {
    if (!col.sortable) return;
    const key = col.key || col.id;
    setSort(prev => {
      if (prev?.key === key) {
        if (prev.dir === 'asc') return { key, dir: 'desc' };
        return null;
      }
      return { key, dir: 'asc' };
    });
  };

  // Selection Logic
  const selectedKeySet = useMemo(() => {
    return new Set(selectedItems.map((item, idx) => keyExtractor(item, idx)));
  }, [selectedItems, keyExtractor]);

  const isAllPageSelected = paginatedData.length > 0 && paginatedData.every((item, idx) => selectedKeySet.has(keyExtractor(item, idx)));
  const isSomePageSelected = paginatedData.some((item, idx) => selectedKeySet.has(keyExtractor(item, idx))) && !isAllPageSelected;

  const handleSelectAllToggle = (checked) => {
    if (!onSelectionChange) return;
    if (checked) {
      const newItems = [...selectedItems];
      paginatedData.forEach((item, idx) => {
        const k = keyExtractor(item, idx);
        if (!selectedKeySet.has(k)) {
          newItems.push(item);
        }
      });
      onSelectionChange(newItems);
    } else {
      const pageKeys = new Set(paginatedData.map((item, idx) => keyExtractor(item, idx)));
      const filtered = selectedItems.filter((item, idx) => !pageKeys.has(keyExtractor(item, idx)));
      onSelectionChange(filtered);
    }
  };

  const handleRowSelect = (item, idx, checked) => {
    if (!onSelectionChange) return;
    const k = keyExtractor(item, idx);
    if (checked) {
      onSelectionChange([...selectedItems, item]);
    } else {
      onSelectionChange(selectedItems.filter((it, i) => keyExtractor(it, i) !== k));
    }
  };

  // Default CSV Exporter if onExport not provided
  const handleDefaultExport = (format) => {
    if (onExport) {
      onExport(format);
      setExportOpen(false);
      return;
    }
    if (format === 'csv') {
      const headers = columns.filter(c => c.key !== 'actions' && c.key !== 'action').map(c => `"${c.label || c.header || c.key}"`).join(',');
      const rows = sortedData.map(row => {
        return columns.filter(c => c.key !== 'actions' && c.key !== 'action').map(c => {
          const val = c.exportValue ? c.exportValue(row) : (row[c.key || c.id] ?? '');
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',');
      });
      const csvContent = headers + '\n' + rows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (format === 'print') {
      window.print();
    }
    setExportOpen(false);
  };

  const padYClass = dense ? 'py-2' : 'py-3.5';

  return (
    <div className={cn('custom-table-card flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm relative', className)}>
      {/* 1. TOP TOOLBAR */}
      {(title || subtitle || searchable || densityToggle || exportFormats.length > 0 || extraToolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3.5 relative z-20 overflow-visible rounded-t-2xl">
          {/* Title & Subtitle */}
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-bold text-slate-800 m-0 tracking-tight flex items-center gap-2">
                {title}
                {totalItems > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {totalItems}
                  </span>
                )}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {extraToolbar}

            {/* Built-in Search */}
            {searchable && (
              <div className="relative w-56 sm:w-64">
                <input
                  type="text"
                  value={activeSearch}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-8 pr-8 text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                {activeSearch && (
                  <button
                    type="button"
                    onClick={() => handleSearchInput('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            )}

            {/* Density Toggle Button */}
            {densityToggle && (
              <button
                type="button"
                onClick={() => setDense(d => !d)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                title={dense ? 'Switch to Comfortable row spacing' : 'Switch to Compact row spacing'}
              >
                {dense ? <Rows3 size={15} /> : <Rows2 size={15} />}
              </button>
            )}

            {/* Export Dropdown */}
            {exportFormats && exportFormats.length > 0 && (
              <div className="relative" ref={exportDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (exportFormats.length === 1) {
                      handleDefaultExport(exportFormats[0]);
                    } else {
                      setExportOpen(v => !v);
                    }
                  }}
                  disabled={exporting || sortedData.length === 0}
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-700 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50"
                >
                  <Download size={14} />
                  <span>{exporting ? 'Exporting...' : 'Export'}</span>
                </button>

                {exportFormats.length > 1 && exportOpen && (
                  <div className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in zoom-in-95 duration-150">
                    {exportFormats.map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => handleDefaultExport(f)}
                        className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition"
                      >
                        {f === 'csv' && <FileSpreadsheet size={14} className="text-emerald-600" />}
                        {f === 'excel' && <FileSpreadsheet size={14} className="text-green-600" />}
                        {f === 'pdf' && <FileText size={14} className="text-red-600" />}
                        {f === 'print' && <Printer size={14} className="text-slate-600" />}
                        <span>Download as {f.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TABLE BODY CONTAINER */}
      <div className="w-full overflow-x-auto overflow-y-auto" style={{ maxHeight: maxBodyHeight || 'calc(100vh - 300px)' }}>
        <table className={cn('w-full border-collapse text-left text-xs', tableClassName)}>
          {/* Header */}
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <tr>
              {/* Checkbox Column */}
              {showCheckbox && (
                <th className="w-10 px-3 py-3 text-center align-middle sticky left-0 z-20 bg-slate-50">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    ref={el => {
                      if (el) el.indeterminate = isSomePageSelected;
                    }}
                    onChange={(e) => handleSelectAllToggle(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
              )}

              {/* Columns */}
              {columns.map((col, cIdx) => {
                const isSortActive = sort?.key === (col.key || col.id);
                const alignClass = col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';

                return (
                  <th
                    key={col.key || col.id || cIdx}
                    style={{ width: col.width, minWidth: col.minWidth }}
                    onClick={() => handleSort(col)}
                    className={cn(
                      'px-3.5 py-3 text-[11.5px] font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap select-none transition-colors',
                      col.sortable && 'cursor-pointer hover:text-slate-900 hover:bg-slate-100/70',
                      alignClass,
                      col.headerClassName
                    )}
                  >
                    <div className={cn('inline-flex items-center gap-1.5', col.align === 'right' && 'flex-row-reverse')}>
                      <span>{col.label || col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {isSortActive ? (
                            sort.dir === 'asc' ? (
                              <ArrowUp size={13} className="text-emerald-700 font-bold" />
                            ) : (
                              <ArrowDown size={13} className="text-emerald-700 font-bold" />
                            )
                          ) : (
                            <ChevronsUpDown size={13} className="opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body Rows */}
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              // Skeleton Loader Rows
              Array.from({ length: skeletonRows }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {showCheckbox && (
                    <td className="px-3 py-3 text-center">
                      <div className="h-4 w-4 rounded bg-slate-200 mx-auto" />
                    </td>
                  )}
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-3.5">
                      <div className="h-3.5 rounded bg-slate-200 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              // Real Data Rows
              paginatedData.map((row, rIdx) => {
                const k = keyExtractor(row, rIdx);
                const isSelected = selectedKeySet.has(k);
                const customRowClass = typeof rowClassName === 'function' ? rowClassName(row, rIdx) : rowClassName;

                return (
                  <tr
                    key={k}
                    onClick={() => onRowClick && onRowClick(row, rIdx)}
                    className={cn(
                      'group transition-colors duration-100',
                      isSelected ? 'bg-emerald-50/70 hover:bg-emerald-50' : rIdx % 2 === 1 ? 'bg-slate-50/40 hover:bg-slate-50' : 'bg-white hover:bg-slate-50/80',
                      onRowClick && 'cursor-pointer',
                      customRowClass
                    )}
                  >
                    {/* Row Checkbox */}
                    {showCheckbox && (
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 px-3 py-2 text-center align-middle sticky left-0 z-[5] bg-inherit"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelect(row, rIdx, e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                    )}

                    {/* Cells */}
                    {columns.map((col, cIdx) => {
                      const alignClass = col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
                      const cellContent = col.render
                        ? col.render(row, (currentPage - 1) * pageSize + rIdx)
                        : (col.cell ? col.cell(row, rIdx) : (row[col.key || col.id] ?? '-'));

                      return (
                        <td
                          key={col.key || col.id || cIdx}
                          style={{ width: col.width, minWidth: col.minWidth }}
                          className={cn(
                            padYClass,
                            'px-3.5 text-slate-800 whitespace-nowrap align-middle',
                            alignClass,
                            col.className
                          )}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              // Empty State
              <tr>
                <td colSpan={columns.length + (showCheckbox ? 1 : 0)} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
                    <EmptyState
                      title={emptyTitle}
                      description={emptyMessage}
                      action={
                        (activeSearch || onEmptyReset) && (
                          <button
                            type="button"
                            onClick={() => {
                              handleSearchInput('');
                              if (onEmptyReset) onEmptyReset();
                            }}
                            className="btn-dairy btn-secondary-dairy btn-sm-dairy mt-2"
                          >
                            Reset Filters
                          </button>
                        )
                      }
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. FLOATING BULK ACTION BAR (when rows selected) */}
      {showCheckbox && selectedItems.length > 0 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-2.5 rounded-full border border-emerald-600/30 bg-slate-900/95 text-white shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black">
              {selectedItems.length}
            </span>
            <span>Items Selected</span>
          </div>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {bulkActionNode ? (
            bulkActionNode
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(selectedItems, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `selected_records_${Date.now()}.json`;
                  a.click();
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
              >
                <Download size={13} />
                <span>Export Selected</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => onSelectionChange && onSelectionChange([])}
            className="text-xs text-slate-400 hover:text-white px-1.5 py-1 transition"
            title="Deselect all"
          >
            Clear
          </button>
        </div>
      )}

      {/* 4. FOOTER PAGINATION (Custom component modeled after board.exchange) */}
      {pagination && !loading && sortedData.length > 0 && (
        <div className="border-t border-slate-100 bg-white px-5 py-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            itemsPerPageOptions={pageSizeOptions}
            alwaysShow={true}
          />
        </div>
      )}
    </div>
  );
};

export default CommonTable;
