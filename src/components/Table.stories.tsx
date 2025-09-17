import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Table from './Table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: { source: { type: 'code' } },
  },
};
export default meta;

type Story = StoryObj<typeof Table>;

const columns = [
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Email', accessor: 'email', sortable: true },
  { header: 'Role', accessor: 'role' },
];

const data = [
  { name: 'Tom Cook', email: 'tom@example.com', role: 'Admin' },
  { name: 'Jane Doe', email: 'jane@example.com', role: 'User' },
  { name: 'John Smith', email: 'john@example.com', role: 'Editor' },
];

export const Basic: Story = {
  render: () => <Table columns={columns} data={data} />,
  parameters: {
    docs: {
      description: {
        story: 'Click on the Name or Email column headers to sort the table. Use the filter inputs below the headers to filter each column.'
      },
      source: {
        type: 'code',
        code: `<Table columns={columns} data={data} />`
      },
    },
  },
};

export const NoData: Story = {
  render: () => <Table columns={columns} data={[]} />,
  parameters: {
    docs: {
      description: { story: 'Table with no data.' },
      source: {
        type: 'code',
        code: `<Table columns={columns} data={[]} />`
      },
    },
  },
};

export const ManyRows: Story = {
  render: () => {
    const manyRows = Array.from({ length: 50 }, (_, i) => ({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 2 === 0 ? 'User' : 'Admin',
    }));
    return <Table columns={columns} data={manyRows} />;
  },
  parameters: {
    docs: {
      description: { story: 'Table with many rows for scroll and performance testing.' },
      source: {
        type: 'code',
        code: `<Table columns={columns} data={manyRows} />`
      },
    },
  },
};

export const SingleColumn: Story = {
  render: () => {
    const singleCol = [{ header: 'Name', accessor: 'name', sortable: true }];
    const singleData = [
      { name: 'Tom Cook' },
      { name: 'Jane Doe' },
      { name: 'John Smith' },
    ];
    return <Table columns={singleCol} data={singleData} />;
  },
  parameters: {
    docs: {
      description: { story: 'Table with only one column.' },
      source: {
        type: 'code',
        code: `<Table columns={singleCol} data={singleData} />`
      },
    },
  },
};

export const CustomCell: Story = {
  render: () => {
    // Custom cell rendering for email as mailto link
    const customColumns = [
      { header: 'Name', accessor: 'name', sortable: true },
      { header: 'Email', accessor: 'email', sortable: true },
      { header: 'Role', accessor: 'role' },
    ];
    const customData = [
      { name: 'Tom Cook', email: 'tom@example.com', role: 'Admin' },
      { name: 'Jane Doe', email: 'jane@example.com', role: 'User' },
      { name: 'John Smith', email: 'john@example.com', role: 'Editor' },
    ];
    // Patch Table to allow custom cell rendering for this story
    return (
      <Table
        columns={customColumns}
        data={customData.map(row => ({
          ...row,
          email: <a href={`mailto:${row.email}`} className="text-blue-600 underline">{row.email}</a>,
        }))}
      />
    );
  },
  parameters: {
    docs: {
      description: { story: 'Table with custom cell rendering (email as mailto link).' },
      source: { type: 'code' },
    },
  },
};

export const NoFilterOnRole: Story = {
  render: () => {
    const columnsNoFilter = [
      { header: 'Name', accessor: 'name', sortable: true },
      { header: 'Email', accessor: 'email', sortable: true },
      { header: 'Role', accessor: 'role', filterable: false },
    ];
    return <Table columns={columnsNoFilter} data={data} />;
  },
  parameters: {
    docs: {
      description: { story: 'Table with filter disabled for the Role column using filterable: false.' },
      source: { type: 'code' },
    },
  },
};

export const AdvancedFilters: Story = {
  render: () => {
    const columnsAdvanced = [
      { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
      { header: 'Role', accessor: 'role', filterType: 'select' as const, options: [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Editor', value: 'Editor' },
      ] },
      { header: 'Age', accessor: 'age', filterType: 'number' as const, sortable: true },
      { header: 'Join Date', accessor: 'joinDate', filterType: 'date' as const },
    ];
    const dataAdvanced = [
      { name: 'Tom Cook', role: 'Admin', age: 32, joinDate: '2023-01-15' },
      { name: 'Jane Doe', role: 'User', age: 28, joinDate: '2022-11-03' },
      { name: 'John Smith', role: 'Editor', age: 40, joinDate: '2021-06-20' },
      { name: 'Alice Lee', role: 'User', age: 35, joinDate: '2023-04-10' },
    ];
    return <Table columns={columnsAdvanced} data={dataAdvanced} />;
  },
  parameters: {
    docs: {
      description: { story: 'Table with advanced filter types: text, select, number, and date.' },
      source: { type: 'code' },
    },
  },
};

export const ApiData: Story = {
  render: () => {
    const columnsApi = [
      { header: 'ID', accessor: 'id', sortable: true, filterType: 'number' as const },
      { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
      { header: 'Email', accessor: 'email', filterType: 'text' as const },
    ];
    const [data, setData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setData([
          { id: 1, name: 'Tom Cook', email: 'tom@example.com' },
          { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
          { id: 3, name: 'John Smith', email: 'john@example.com' },
        ]);
        setLoading(false);
      }, 1500);
    }, []);
    return <Table columns={columnsApi} data={data} loading={loading} />;
  },
  parameters: {
    docs: {
      description: { story: 'Table fetching data from an API (simulated with setTimeout). Shows loading state.' },
      source: { type: 'code' },
    },
  },
};

export const ClientSidePagination: Story = {
  render: () => {
    const columnsPag = [
      { header: 'ID', accessor: 'id', sortable: true, filterType: 'number' as const },
      { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
    ];
    const manyRows = Array.from({ length: 42 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
    }));
    return <Table columns={columnsPag} data={manyRows} pagination pageSize={10} />;
  },
  parameters: {
    docs: {
      description: { story: 'Table with client-side pagination (Table slices data).' },
      source: { type: 'code' },
    },
  },
};

export const ServerSidePagination: Story = {
  render: () => {
    const columnsPag = [
      { header: 'ID', accessor: 'id', sortable: true, filterType: 'number' as const },
      { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
    ];
    const totalCount = 42;
    const pageSize = 10;
    const [page, setPage] = React.useState(1);
    const [data, setData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        // Simulate fetching only the current page
        const start = (page - 1) * pageSize;
        setData(Array.from({ length: Math.min(pageSize, totalCount - start) }, (_, i) => ({
          id: start + i + 1,
          name: `User ${start + i + 1}`,
        })));
        setLoading(false);
      }, 800);
    }, [page]);
    return (
      <Table
        columns={columnsPag}
        data={data}
        loading={loading}
        pagination
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        totalCount={totalCount}
      />
    );
  },
  parameters: {
    docs: {
      description: { story: 'Table with server-side pagination (Table is controlled, simulates fetching new data on page change).' },
      source: { type: 'code' },
    },
  },
};

export const ServerSideSortAndFilter: Story = {
  render: () => {
    const columnsApi = [
      { header: 'ID', accessor: 'id', sortable: true, filterType: 'number' as const },
      { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
      { header: 'Role', accessor: 'role', filterType: 'select' as const, options: [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Editor', value: 'Editor' },
      ] },
    ];
    const totalCount = 42;
    const pageSize = 10;
    const [page, setPage] = React.useState(1);
    const [sortBy, setSortBy] = React.useState<string>('id');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = React.useState<Record<string, string>>({});
    const [data, setData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        // Simulate server-side sort/filter/pagination
        let allRows: Record<string, any>[] = Array.from({ length: totalCount }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'User' : 'Editor',
        }));
        // Filter
        allRows = allRows.filter(row => {
          if (filters.id && String(row['id']) !== filters.id) return false;
          if (filters.name && !String(row['name']).toLowerCase().includes(filters.name.toLowerCase())) return false;
          if (filters.role && row['role'] !== filters.role) return false;
          return true;
        });
        // Sort
        if (sortBy) {
          allRows.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (aVal === bVal) return 0;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return sortDirection === 'asc'
              ? String(aVal).localeCompare(String(bVal))
              : String(bVal).localeCompare(String(aVal));
          });
        }
        // Pagination
        const start = (page - 1) * pageSize;
        setData(allRows.slice(start, start + pageSize));
        setLoading(false);
      }, 800);
    }, [page, sortBy, sortDirection, filters]);
    return (
      <Table
        columns={columnsApi}
        data={data}
        loading={loading}
        pagination
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        totalCount={totalCount}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={(sb, sd) => { setSortBy(sb); setSortDirection(sd); setPage(1); }}
        filters={filters}
        onFiltersChange={f => { setFilters(f); setPage(1); }}
      />
    );
  },
  parameters: {
    docs: {
      description: { story: 'Table with server-side (API) sorting, filtering, and pagination. All are controlled and trigger simulated API calls.' },
      source: { type: 'code' },
    },
  },
};

export const VirtualizedRows: Story = {
  render: () => {
    const columns = [
      { header: 'ID', accessor: 'id', sortable: true, filterType: 'number' as const },
      { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
    ];
    const manyRows = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
    }));
    return <Table columns={columns} data={manyRows} virtualized listHeight={400} rowHeight={48} />;
  },
  parameters: {
    docs: {
      description: { story: 'Table with custom virtualization enabled (1000+ rows, only visible rows are rendered using custom logic, not react-window).' },
      source: { type: 'code' },
    },
  },
};

export const VirtualizedApiSortFilter: Story = {
  render: () => {
    const columns = [
      { header: 'ID', accessor: 'id', sortable: true, filterType: 'number' as const },
      { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
      { header: 'Role', accessor: 'role', filterType: 'select' as const, options: [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Editor', value: 'Editor' },
      ] },
    ];
    const totalCount = 1000;
    const pageSize = 1000; // show all for virtualization
    const [data, setData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [sortBy, setSortBy] = React.useState<string>('id');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = React.useState<Record<string, string>>({});
    React.useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        let allRows: Record<string, any>[] = Array.from({ length: totalCount }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'User' : 'Editor',
        }));
        // Filter
        allRows = allRows.filter(row => {
          if (filters.id && String(row['id']) !== filters.id) return false;
          if (filters.name && !String(row['name']).toLowerCase().includes(filters.name.toLowerCase())) return false;
          if (filters.role && row['role'] !== filters.role) return false;
          return true;
        });
        // Sort
        if (sortBy) {
          allRows.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (aVal === bVal) return 0;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return sortDirection === 'asc'
              ? String(aVal).localeCompare(String(bVal))
              : String(bVal).localeCompare(String(aVal));
          });
        }
        setData(allRows);
        setLoading(false);
      }, 800);
    }, [sortBy, sortDirection, filters]);
    return (
      <Table
        columns={columns}
        data={data}
        loading={loading}
        virtualized
        listHeight={400}
        rowHeight={48}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={(sb, sd) => { setSortBy(sb); setSortDirection(sd); }}
        filters={filters}
        onFiltersChange={setFilters}
      />
    );
  },
  parameters: {
    docs: {
      description: { story: 'Table with custom virtualization, API data, filter, and sorting. 1000+ rows, all features enabled.' },
      source: { type: 'code' },
    },
  },
};

export const ManyColumns: Story = {
  render: () => {
    const columns = [
      { header: 'ID', accessor: 'id', sortable: true, filterType: 'number' as const },
      { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
      { header: 'Email', accessor: 'email', filterType: 'text' as const },
      { header: 'Role', accessor: 'role', filterType: 'select' as const, options: [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Editor', value: 'Editor' },
      ] },
      { header: 'Age', accessor: 'age', filterType: 'number' as const },
      { header: 'Department', accessor: 'department', filterType: 'text' as const },
      { header: 'Status', accessor: 'status', filterType: 'select' as const, options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ] },
      { header: 'Location', accessor: 'location', filterType: 'text' as const },
    ];
    const manyRows = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'User' : 'Editor',
      age: 20 + (i % 30),
      department: ['Engineering', 'HR', 'Sales', 'Marketing'][i % 4],
      status: i % 2 === 0 ? 'Active' : 'Inactive',
      location: ['New York', 'London', 'Berlin', 'Tokyo'][i % 4],
    }));
    return <Table columns={columns} data={manyRows} virtualized listHeight={400} rowHeight={48} />;
  },
  parameters: {
    docs: {
      description: { story: 'Table with many columns (8+), custom virtualization, and 100 rows.' },
      source: { type: 'code' },
    },
  },
};

export const RowClickAndDoubleClick: Story = {
  render: () => {
    const columns = [
      { header: 'ID', accessor: 'id', sortable: true, filterType: 'number' as const },
      { header: 'Name', accessor: 'name', sortable: true, filterType: 'text' as const },
      { header: 'Role', accessor: 'role', filterType: 'select' as const, options: [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Editor', value: 'Editor' },
      ] },
    ];
    const data = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'User' : 'Editor',
    }));
    const [lastEvent, setLastEvent] = React.useState<string>('');
    return (
      <>
        <div className="mb-2 text-sm text-gray-700">{lastEvent}</div>
        <Table
          columns={columns}
          data={data}
          virtualized
          listHeight={300}
          rowHeight={40}
          onRowClick={(row, rowIndex) => setLastEvent(`Clicked row ${rowIndex! + 1}: ${row.name}`)}
          onRowDoubleClick={(row, rowIndex) => setLastEvent(`Double-clicked row ${rowIndex! + 1}: ${row.name}`)}
        />
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates Table row click and double click events. Shows the last event above the table.'
      },
      source: { type: 'code' },
    },
  },
};
