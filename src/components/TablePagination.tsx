import React from 'react';
import tableClasses from './Table.styles';

interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalRows: number;
  handlePageChange: (newPage: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({ page, totalPages, totalRows, handlePageChange }) => (
  <div className={tableClasses.pagination}>
    <div>
      Page {page} of {totalPages} (Total: {totalRows})
    </div>
    <div className="flex gap-1">
      <button
        className={tableClasses.paginationButton}
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          className={
            tableClasses.paginationButton +
            (p === page ? ` ${tableClasses.paginationButtonActive}` : '') +
            ' mx-0.5'
          }
          onClick={() => handlePageChange(p)}
          disabled={p === page}
        >
          {p}
        </button>
      ))}
      <button
        className={tableClasses.paginationButton}
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  </div>
);

export default TablePagination;
