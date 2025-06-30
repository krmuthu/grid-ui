import React from 'react';
import Grid from './Grid';

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebar, header, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar: horizontal on small, vertical on md+ */}
      <aside className="w-full md:w-auto flex-shrink-0 bg-white shadow-md z-10">
        {sidebar}
      </aside>
      <div className="flex-1 flex flex-col">
        {/* Header: always on top of main content */}
        <header className="bg-white shadow p-4 sticky top-0 z-20">
          {header}
        </header>
        {/* Main Content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 