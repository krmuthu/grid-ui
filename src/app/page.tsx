'use client'
import Grid from '@/components/Grid';
import { Button as Botton } from "@/components/Button";
import DashboardLayout from '@/components/DashboardLayout';
import FormLayout from '@/components/FormLayout';
import SideNavbar from '@/components/SideNavbar';
import React, { useState, useEffect } from 'react';

import { Button, DateTimePicker, Avatar, TextField } from "fun-tailwindcss-ui-1";

export default function Home() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  useEffect(() => {
    // Function to check screen size and set minimized state
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarMinimized(true);
      } else {
        setSidebarMinimized(false);
      }
    };
    // Set on mount
    handleResize();
    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DashboardLayout
      sidebar={
        <SideNavbar
          items={[
            { label: 'Dashboard', active: true, icon: <span className="material-icons">dashboard</span> },
            { label: 'Settings', icon: <span className="material-icons">settings</span> },
            { label: 'Profile', icon: <span className="material-icons">person</span> },
          ]}
          minimized={sidebarMinimized}
          onToggleMinimize={() => setSidebarMinimized((m) => !m)}
          bottom={
            <div className="flex flex-col gap-2">
              <button className="flex items-center px-4 py-2 rounded hover:bg-gray-100 text-gray-700 w-full">
                <span className="material-icons mr-2">settings</span> {!sidebarMinimized && 'Settings'}
              </button>
              <button className="flex items-center px-4 py-2 rounded hover:bg-gray-100 text-red-600 w-full">
                <span className="material-icons mr-2">logout</span> {!sidebarMinimized && 'Logout'}
              </button>
            </div>
          }
        />
      }
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard Header</h1>
          <Avatar name="muthu kumar" />
        </div>
      }
    >
      <h2 className="text-xl font-semibold mb-4">Form Example</h2>
      <FormLayout gap={4}>
        <TextField label="First Name" />
        <TextField label="Last Name" />
        <DateTimePicker label="Date of Birth" />
        <TextField label="Email" error={true} />
        <Button variant="primary">Submit</Button>
        <Button variant="secondary">Cancel</Button>
      </FormLayout>
    </DashboardLayout>
  );
}