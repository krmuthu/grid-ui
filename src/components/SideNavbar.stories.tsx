import type { Meta, StoryObj } from '@storybook/react';
import SideNavbar from './SideNavbar';
import React, { useState } from 'react';

const meta: Meta<typeof SideNavbar> = {
  title: 'Components/SideNavbar',
  component: SideNavbar,
};
export default meta;

type Story = StoryObj<typeof SideNavbar>;

// SVG Icons
const DashboardIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><path d="M3 13h4v4H3v-4zM3 3h4v8H3V3zm5 0h9v4H8V3zm0 5h9v12H8V8z" /></svg>
);
const ProjectsIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><rect x="3" y="7" width="14" height="10" rx="2" /><path d="M8 7V5a2 2 0 1 1 4 0v2" /></svg>
);
const TeamIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><circle cx="10" cy="6" r="3" /><path d="M2 17a6 6 0 0 1 12 0" /></svg>
);
const CalendarIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><rect x="3" y="4" width="14" height="13" rx="2" /><path d="M16 2v4M4 2v4" /></svg>
);
const SettingsIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><circle cx="10" cy="10" r="3" /><path d="M4.22 4.22l1.42 1.42M2 10h2M4.22 15.78l1.42-1.42M10 18v-2M15.78 15.78l-1.42-1.42M18 10h-2M15.78 4.22l-1.42 1.42M10 2v2" /></svg>
);
const HelpIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><circle cx="10" cy="10" r="8" /><path d="M9 9a2 2 0 1 1 2 2c0 1-2 1-2 3" /><circle cx="10" cy="15" r="1" /></svg>
);
const ReportsIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M7 13V7M10 13V10M13 13V4" /></svg>
);
const AnnualIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><path d="M4 10h12M10 4v12" /></svg>
);
const MonthlyIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="w-5 h-5"><circle cx="10" cy="10" r="8" /><path d="M10 2v8l6 4" /></svg>
);

const navItems = [
  { label: 'Dashboard', icon: DashboardIcon, active: true },
  { label: 'Projects', icon: ProjectsIcon },
  { label: 'Team', icon: TeamIcon },
  { label: 'Calendar', icon: CalendarIcon },
];

const secondaryNavItems = [
  { label: 'Settings', icon: SettingsIcon },
  { label: 'Help', icon: HelpIcon },
];

const footerProfile = (minimized: boolean) => (
  minimized ? (
    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
  ) : (
    <>
      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
      <div className="flex flex-col">
        <span className="font-semibold text-sm">Tom Cook</span>
        <span className="text-xs text-gray-500">tom@example.com</span>
      </div>
      <button className="ml-auto text-red-500 hover:underline text-xs">Logout</button>
    </>
  )
);

export const TailwindUISidebarFull: Story = {
  render: () => (
    <div className="h-screen bg-gray-50 flex">
      <SideNavbar
        brand={
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-8 bg-blue-600 rounded-full" />
            <span className="font-bold text-xl text-gray-900">Tailwind UI</span>
          </div>
        }
        items={navItems}
        secondaryItems={secondaryNavItems}
        footer={footerProfile(false)}
      />
      <div className="flex-1" />
    </div>
  ),
};

export const TailwindUISidebar: Story = {
  render: () => (
    <div className="h-screen bg-gray-50 flex">
      <SideNavbar
        brand={
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-8 bg-blue-600 rounded-full" />
            <span className="font-bold text-xl text-gray-900">Tailwind UI</span>
          </div>
        }
        items={navItems}
        secondaryItems={secondaryNavItems}
        footer={footerProfile(false)}
      />
      <div className="flex-1" />
    </div>
  ),
};

export const WithSecondaryNav: Story = {
  render: () => (
    <div className="h-screen bg-gray-50 flex">
      <SideNavbar
        brand={
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-8 bg-blue-600 rounded-full" />
            <span className="font-bold text-xl text-gray-900">Tailwind UI</span>
          </div>
        }
        items={navItems}
        secondaryItems={secondaryNavItems}
        footer={footerProfile(false)}
      />
      <div className="flex-1" />
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <div className="h-screen bg-gray-50">
      <SideNavbar
        items={navItems}
        brand={<span className="font-bold text-xl text-blue-600">MyApp</span>}
        footer={footerProfile(false)}
      />
    </div>
  ),
};

export const Minimized: Story = {
  render: () => (
    <div className="h-screen bg-gray-50">
      <SideNavbar
        items={navItems}
        minimized
        brand={<span className="font-bold text-xl text-blue-600">MyApp</span>}
        footer={footerProfile(true)}
      />
    </div>
  ),
};

export const WithMinimizeToggle: Story = {
  render: () => {
    const [minimized, setMinimized] = React.useState(false);
    return (
      <div className="h-screen bg-gray-50">
        <SideNavbar
          items={navItems}
          minimized={minimized}
          onToggleMinimize={() => setMinimized((m) => !m)}
          brand={<span className="font-bold text-xl text-blue-600">MyApp</span>}
          footer={footerProfile(minimized)}
        />
      </div>
    );
  },
};

export const AdvancedFeatures: Story = {
  render: () => {
    const [minimized, setMinimized] = React.useState(false);
    const navItemsWithBadges = [
      { label: 'Dashboard', icon: DashboardIcon, active: true, badge: 5 },
      { label: 'Projects', icon: ProjectsIcon, badge: 12 },
      { label: 'Team', icon: TeamIcon },
      { label: 'Calendar', icon: CalendarIcon, badge: '20+' },
    ];
    const collapsibleSections = [
      {
        label: 'Reports',
        icon: ReportsIcon,
        defaultOpen: true,
        items: [
          { label: 'Annual', icon: AnnualIcon, badge: 2 },
          { label: 'Monthly', icon: MonthlyIcon },
        ],
      },
    ];
    return (
      <div className="h-screen bg-gray-50 flex">
        <SideNavbar
          brand={
            <div className="flex items-center gap-2">
              <span className="inline-block w-8 h-8 bg-blue-600 rounded-full" />
              <span className="font-bold text-xl text-gray-900">Tailwind UI</span>
            </div>
          }
          items={navItemsWithBadges}
          secondaryItems={secondaryNavItems}
          collapsibleSections={collapsibleSections}
          footer={footerProfile(minimized)}
          minimized={minimized}
          onToggleMinimize={() => setMinimized((m) => !m)}
        />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => setMinimized((m) => !m)}
          >
            Toggle Minimize
          </button>
        </div>
      </div>
    );
  },
}; 