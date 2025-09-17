import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Table from './Table';

const columns = [
  { header: 'ID', accessor: 'id', sortable: true, filterType: 'number' as const },
  { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
  { header: 'Role', accessor: 'role', filterType: 'select' as const, options: [
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' },
    { label: 'Editor', value: 'Editor' },
  ] },
];
const data = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
  { id: 3, name: 'Charlie', role: 'Editor' },
];

describe('Table', () => {
  it('renders headers', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('renders rows', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('supports sorting', () => {
    render(<Table columns={columns} data={data} />);
    // Click Name header to sort ascending
    fireEvent.click(screen.getByText('Name'));
    const rows = screen.getAllByRole('row');
    // The first data row should be Alice (alphabetical)
    expect(within(rows[2]).getByText('Alice')).toBeInTheDocument();
  });

  it('supports filtering', () => {
    render(<Table columns={columns} data={data} />);
    // Filter for Bob
    const nameFilter = screen.getAllByPlaceholderText('Filter Name')[0];
    fireEvent.change(nameFilter, { target: { value: 'Bob' } });
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('supports custom virtualization', () => {
    const manyRows = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      role: i % 2 === 0 ? 'Admin' : 'User',
    }));
    render(<Table columns={columns} data={manyRows} virtualized listHeight={200} rowHeight={40} />);
    // Only a subset of rows should be in the DOM
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 10')).toBeInTheDocument();
    // A row far outside the viewport should not be rendered
    expect(screen.queryByText('User 100')).not.toBeInTheDocument();
  });

  it('calls onRowClick with correct row and index', () => {
    const handleClick = vi.fn();
    render(<Table columns={columns} data={data} onRowClick={handleClick} />);
    const rows = screen.getAllByRole('row');
    // The first data row is rows[1] (rows[0] is header)
    fireEvent.click(within(rows[1]).getByText('Alice'));
    expect(handleClick).toHaveBeenCalledWith(data[0], 0);
  });

  it('calls onRowDoubleClick with correct row and index', () => {
    const handleDoubleClick = vi.fn();
    render(<Table columns={columns} data={data} onRowDoubleClick={handleDoubleClick} />);
    const rows = screen.getAllByRole('row');
    fireEvent.doubleClick(within(rows[2]).getByText('Bob'));
    expect(handleDoubleClick).toHaveBeenCalledWith(data[1], 1);
  });
});
