import React, { useState, useRef, useEffect, useCallback } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TablePagination from './TablePagination';
import tableClasses from './Table.styles';

export interface Column {
  header: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'number' | 'date';
  options?: Array<{ label: string; value: any }>; // for select/radio
}

interface TableProps {
  columns?: Column[];
  data?: Record<string, any>[];
  className?: string;
  loading?: boolean;
  // Pagination
  pagination?: boolean;
  page?: number; // 1-based
  pageSize?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number; // for server-side
  // Controlled sort/filter for API
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
  filters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  // Custom Virtualization
  customVirtualized?: boolean;
  rowHeight?: number; // px, default 48
  listHeight?: number; // px, default 400
  // Row events
  onRowClick?: (row: Record<string, any>, rowIndex?: number) => void;
  onRowDoubleClick?: (row: Record<string, any>, rowIndex?: number) => void;
}

const DEBOUNCE_MS = 400;
const CUSTOM_OVERSCAN = 5;

const Table: React.FC<TableProps> = ({
  columns = [],
  data = [],
  className = '',
  loading = false,
  pagination = false,
  page: controlledPage,
  pageSize = 10,
  onPageChange,
  totalCount,
  sortBy: controlledSortBy,
  sortDirection: controlledSortDirection,
  onSortChange,
  filters: controlledFilters,
  onFiltersChange,
  customVirtualized = false,
  rowHeight = 48,
  listHeight = 400,
  onRowClick,
  onRowDoubleClick,
}) => {
  // Internal state for uncontrolled mode
  const [internalSortBy, setInternalSortBy] = useState<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('asc');
  const [internalFilters, setInternalFilters] = useState<Record<string, string>>({});
  const [internalPage, setInternalPage] = useState(1);

  // For debounced API filter calls, keep a local input state
  const [localFilterInputs, setLocalFilterInputs] = useState<Record<string, string>>(controlledFilters ?? {});
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // For custom virtualization
  const [scrollTop, setScrollTop] = useState(0);
  const customContainerRef = useRef<HTMLDivElement>(null);

  // Keep localFilterInputs in sync with controlledFilters
  useEffect(() => {
    if (controlledFilters) {
      setLocalFilterInputs(controlledFilters);
    }
  }, [controlledFilters]);

  // Use controlled or internal state
  const sortBy = controlledSortBy ?? internalSortBy;
  const sortDirection = controlledSortDirection ?? internalSortDirection;
  const filters = onFiltersChange ? localFilterInputs : (controlledFilters ?? internalFilters);
  const page = controlledPage ?? internalPage;

  const handleSort = (accessor: string) => {
    let newSortBy = accessor;
    let newSortDirection: 'asc' | 'desc' = 'asc';
    if (sortBy === accessor) {
      newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    if (onSortChange) {
      onSortChange(newSortBy, newSortDirection);
    } else {
      setInternalSortBy(newSortBy);
      setInternalSortDirection(newSortDirection);
    }
  };

  const handleFilterChange = (accessor: string, value: string) => {
    if (onFiltersChange) {
      // Always update local input immediately
      setLocalFilterInputs((prev) => ({ ...prev, [accessor]: value }));
      // Debounce API call
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onFiltersChange({ ...localFilterInputs, [accessor]: value });
      }, DEBOUNCE_MS);
    } else {
      setInternalFilters((prev) => ({ ...prev, [accessor]: value }));
    }
    // Reset to first page on filter change
    if (!onPageChange) setInternalPage(1);
    else onPageChange(1);
  };

  // Filter data (client-side only)
  const filteredData = React.useMemo(() => {
    if (onFiltersChange) return data; // skip filtering if controlled
    return data.filter((row) =>
      columns.every((col) => {
        if (col.filterable === false) return true;
        const filterValue = filters[col.accessor];
        if (!filterValue) return true;
        const cellValue = row[col.accessor];
        if (cellValue == null) return false;
        switch (col.filterType) {
          case 'number':
            return String(cellValue) === filterValue;
          case 'date':
            return String(cellValue) === filterValue;
          case 'select':
            return String(cellValue) === filterValue;
          case 'text':
          default:
            return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
        }
      })
    );
  }, [data, columns, filters, onFiltersChange]);

  // Sort data (client-side only)
  const sortedData = React.useMemo(() => {
    if (onSortChange) return filteredData; // skip sorting if controlled
    if (!sortBy) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      if (a[sortBy] == null) return 1;
      if (b[sortBy] == null) return -1;
      if (a[sortBy] === b[sortBy]) return 0;
      if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
        return sortDirection === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
      }
      return sortDirection === 'asc'
        ? String(a[sortBy]).localeCompare(String(b[sortBy]))
        : String(b[sortBy]).localeCompare(String(a[sortBy]));
    });
    return sorted;
  }, [filteredData, sortBy, sortDirection, onSortChange]);

  // Pagination logic
  let paginatedData = sortedData;
  let totalRows = sortedData.length;
  let totalPages = 1;
  if (pagination) {
    if (onPageChange && typeof totalCount === 'number') {
      // Server-side: data is already paged, use totalCount
      totalRows = totalCount;
      totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
      paginatedData = sortedData; // assume data is already paged
    } else {
      // Client-side: slice data
      totalRows = sortedData.length;
      totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
      const start = (page - 1) * pageSize;
      paginatedData = sortedData.slice(start, start + pageSize);
    }
  }

  // Custom virtualization calculations
  let customStartIdx = 0, customEndIdx = 0, customVisibleRows: typeof paginatedData = [];
  if (customVirtualized) {
    const visibleCount = Math.ceil(listHeight / rowHeight);
    customStartIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - CUSTOM_OVERSCAN);
    customEndIdx = Math.min(paginatedData.length, customStartIdx + visibleCount + CUSTOM_OVERSCAN * 2);
    customVisibleRows = paginatedData.slice(customStartIdx, customEndIdx);
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (onPageChange) onPageChange(newPage);
    else setInternalPage(newPage);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div
      className={`overflow-x-auto ${className}`}
      ref={customVirtualized ? customContainerRef : undefined}
      style={customVirtualized ? { height: listHeight, overflowY: 'auto' } : undefined}
      onScroll={customVirtualized ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined}
    >
      <table
        className={tableClasses.table + (customVirtualized ? ` h-[${listHeight}px]` : '')}
      >
        <TableHeader
          columns={columns}
          filters={filters}
          handleSort={handleSort}
          handleFilterChange={handleFilterChange}
          sortBy={sortBy}
          sortDirection={sortDirection}
        />
        <TableBody
          columns={columns}
          paginatedData={paginatedData}
          loading={loading}
          customVirtualized={customVirtualized}
          rowHeight={rowHeight}
          listHeight={listHeight}
          scrollTop={scrollTop}
          setScrollTop={setScrollTop}
          overscan={CUSTOM_OVERSCAN}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
        />
      </table>
      {pagination && totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalRows={totalRows}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Table;
