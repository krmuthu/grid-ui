import React from 'react';
import type { Column } from './Table';
import tableClasses from './Table.styles';

interface TableRowProps {
  columns: Column[];
  row: Record<string, any>;
  rowIndex?: number;
  style?: React.CSSProperties;
  onClick?: (row: Record<string, any>, rowIndex?: number) => void;
  onDoubleClick?: (row: Record<string, any>, rowIndex?: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({ columns, row, rowIndex, style, onClick, onDoubleClick }) => (
  <tr
    style={style}
    key={rowIndex}
    className={tableClasses.tr}
    onClick={onClick ? () => onClick(row, rowIndex) : undefined}
    onDoubleClick={onDoubleClick ? () => onDoubleClick(row, rowIndex) : undefined}
  >
    {columns.map((col) => (
      <td key={col.accessor} className={tableClasses.td}>
        {row[col.accessor]}
      </td>
    ))}
  </tr>
);

export default TableRow;
