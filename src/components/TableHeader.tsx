import React from 'react';
import type { Column } from './Table';
import tableClasses from './Table.styles';

interface TableHeaderProps {
  columns: Column[];
  filters: Record<string, string>;
  handleSort: (accessor: string) => void;
  handleFilterChange: (accessor: string, value: string) => void;
  sortBy: string | null | undefined;
  sortDirection: 'asc' | 'desc';
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  filters,
  handleSort,
  handleFilterChange,
  sortBy,
  sortDirection,
}) => (
  <thead className={tableClasses.thead}>
    <tr className={tableClasses.tr}>
      {columns.map((col) => (
        <th
          key={col.accessor}
          className={
            tableClasses.th + (col.sortable ? ` ${tableClasses.thSortable}` : '')
          }
          onClick={col.sortable ? () => handleSort(col.accessor) : undefined}
        >
          <span className="inline-flex items-center">
            {col.header}
            {col.sortable && sortBy === col.accessor && (
              <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
            )}
            {col.sortable && sortBy !== col.accessor && (
              <span className="ml-1 text-gray-300">▲</span>
            )}
          </span>
        </th>
      ))}
    </tr>
    {/* Filter row */}
    <tr className={tableClasses.tr}>
      {columns.map((col) => (
        <th key={col.accessor} className={tableClasses.thFilter}>
          {col.filterable === false ? null : col.filterType === 'select' && col.options ? (
            <select
              value={filters[col.accessor] || ''}
              onChange={e => handleFilterChange(col.accessor, e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All</option>
              {col.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : col.filterType === 'number' ? (
            <input
              type="number"
              value={filters[col.accessor] || ''}
              onChange={e => handleFilterChange(col.accessor, e.target.value)}
              placeholder={`Filter ${col.header}`}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          ) : col.filterType === 'date' ? (
            <input
              type="date"
              value={filters[col.accessor] || ''}
              onChange={e => handleFilterChange(col.accessor, e.target.value)}
              placeholder={`Filter ${col.header}`}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          ) : (
            <input
              type="text"
              value={filters[col.accessor] || ''}
              onChange={e => handleFilterChange(col.accessor, e.target.value)}
              placeholder={`Filter ${col.header}`}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          )}
        </th>
      ))}
    </tr>
  </thead>
);

export default TableHeader;
