import React from 'react';
import type { Column } from './Table';
import tableClasses from './Table.styles';

interface TableRowProps {
  columns: Column[];
  row: Record<string, any>;
  rowIndex?: number;
  style?: React.CSSProperties;
}

const TableRow: React.FC<TableRowProps> = ({ columns, row, rowIndex, style }) => (
  <tr style={style} key={rowIndex} className={tableClasses.tr}>
    {columns.map((col) => (
      <td key={col.accessor} className={tableClasses.td}>
        {row[col.accessor]}
      </td>
    ))}
  </tr>
);

export default TableRow;
