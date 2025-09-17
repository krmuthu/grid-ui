import React from 'react';
import type { Column } from './Table';
import TableRow from './TableRow';
import tableClasses from './Table.styles';

interface TableBodyProps {
  columns: Column[];
  paginatedData: Record<string, any>[];
  loading: boolean;
  customVirtualized: boolean;
  rowHeight: number;
  listHeight: number;
  scrollTop: number;
  setScrollTop: (scrollTop: number) => void;
  overscan?: number;
}

const TableBody: React.FC<TableBodyProps> = ({
  columns,
  paginatedData,
  loading,
  customVirtualized,
  rowHeight,
  listHeight,
  scrollTop,
  setScrollTop,
  overscan = 5,
}) => {
  // Custom virtualization calculations
  let customStartIdx = 0, customEndIdx = 0, customVisibleRows: typeof paginatedData = [];
  if (customVirtualized) {
    const visibleCount = Math.ceil(listHeight / rowHeight);
    customStartIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    customEndIdx = Math.min(paginatedData.length, customStartIdx + visibleCount + overscan * 2);
    customVisibleRows = paginatedData.slice(customStartIdx, customEndIdx);
  }

  if (loading) {
    return (
      <tbody className={tableClasses.tbody}>
        <tr className={tableClasses.tr}>
          <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
              Loading...
            </span>
          </td>
        </tr>
      </tbody>
    );
  }

  if (customVirtualized) {
    return (
      <tbody className={tableClasses.tbody}>
        <tr className={tableClasses.tr} style={{ height: customStartIdx * rowHeight }} />
        {customVisibleRows.map((row, i) => (
          <TableRow key={customStartIdx + i} columns={columns} row={row} rowIndex={customStartIdx + i} style={{ height: rowHeight }} />
        ))}
        <tr className={tableClasses.tr} style={{ height: (paginatedData.length - customEndIdx) * rowHeight }} />
      </tbody>
    );
  }

  return (
    <tbody className={tableClasses.tbody}>
      {paginatedData.map((row, i) => (
        <TableRow key={i} columns={columns} row={row} rowIndex={i} />
      ))}
    </tbody>
  );
};

export default TableBody;
