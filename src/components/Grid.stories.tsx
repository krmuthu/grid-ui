import type { Meta, StoryObj } from '@storybook/react';
import Grid from './Grid';
import React from 'react';

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
};
export default meta;

type Story = StoryObj<typeof Grid>;

export const Basic: Story = {
  render: () => (
    <Grid container gap={4} columns={6}>
      <Grid item xs={3} className="bg-blue-200 p-4 text-center">xs=3</Grid>
      <Grid item xs={3} className="bg-green-200 p-4 text-center">xs=3</Grid>
      <Grid item xs={2} className="bg-yellow-200 p-4 text-center">xs=2</Grid>
      <Grid item xs={4} className="bg-pink-200 p-4 text-center">xs=4</Grid>
      <Grid item xs={6} className="bg-purple-200 p-4 text-center">xs=6</Grid>
    </Grid>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Grid container gap={4} columns={6}>
      <Grid item xs={6} md={3} className="bg-blue-200 p-4 text-center">xs=6 md=3</Grid>
      <Grid item xs={6} md={3} className="bg-green-200 p-4 text-center">xs=6 md=3</Grid>
      <Grid item xs={6} md={2} className="bg-yellow-200 p-4 text-center">xs=6 md=2</Grid>
      <Grid item xs={6} md={4} className="bg-pink-200 p-4 text-center">xs=6 md=4</Grid>
    </Grid>
  ),
};

export const WithGap: Story = {
  render: () => (
    <Grid container gap={8} columns={4}>
      <Grid item xs={2} className="bg-blue-200 p-4 text-center">xs=2</Grid>
      <Grid item xs={2} className="bg-green-200 p-4 text-center">xs=2</Grid>
      <Grid item xs={1} className="bg-yellow-200 p-4 text-center">xs=1</Grid>
      <Grid item xs={3} className="bg-pink-200 p-4 text-center">xs=3</Grid>
    </Grid>
  ),
};

export const NestedGrid: Story = {
  render: () => (
    <Grid container gap={4} columns={6}>
      <Grid item xs={4} className="bg-blue-200 p-4 text-center">
        Parent xs=4
        <Grid container gap={2} columns={2} className="mt-2">
          <Grid item xs={1} className="bg-green-200 p-2">Nested 1</Grid>
          <Grid item xs={1} className="bg-yellow-200 p-2">Nested 2</Grid>
        </Grid>
      </Grid>
      <Grid item xs={2} className="bg-pink-200 p-4 text-center">xs=2</Grid>
    </Grid>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-full border-2 border-dashed border-gray-400 p-2">
      <Grid container gap={4} columns={4}>
        <Grid item xs={2} className="bg-blue-200 p-4 text-center">xs=2</Grid>
        <Grid item xs={2} className="bg-green-200 p-4 text-center">xs=2</Grid>
      </Grid>
    </div>
  ),
};

export const CustomColumns: Story = {
  render: () => (
    <>
      <div className="mb-4">
        <span className="font-semibold">4 Columns:</span>
        <Grid container gap={2} columns={4}>
          <Grid item xs={1} className="bg-blue-200 p-2 text-center">1</Grid>
          <Grid item xs={1} className="bg-green-200 p-2 text-center">2</Grid>
          <Grid item xs={1} className="bg-yellow-200 p-2 text-center">3</Grid>
          <Grid item xs={1} className="bg-pink-200 p-2 text-center">4</Grid>
        </Grid>
      </div>
      <div>
        <span className="font-semibold">8 Columns:</span>
        <Grid container gap={2} columns={8}>
          {[...Array(8)].map((_, i) => (
            <Grid key={i} item xs={1} className="bg-purple-200 p-2 text-center">{i + 1}</Grid>
          ))}
        </Grid>
      </div>
    </>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Grid container columns={3} className="items-center justify-items-center h-40 bg-gray-100">
      <Grid item xs={1} className="bg-blue-200 p-4 text-center">Center</Grid>
      <Grid item xs={1} className="bg-green-200 p-4 text-center self-end">Bottom</Grid>
      <Grid item xs={1} className="bg-yellow-200 p-4 text-center self-start">Top</Grid>
    </Grid>
  ),
};

export const DashboardLayoutExample: Story = {
  render: () => (
    <Grid container columns={6} gap={4} className="min-h-[300px]">
      <Grid item xs={1} className="bg-gray-800 text-white flex items-center justify-center p-4">Sidebar</Grid>
      <Grid item xs={5} className="flex flex-col">
        <div className="bg-gray-200 p-4 mb-4 text-center">Header</div>
        <div className="flex-1 bg-white p-4 text-center">Main Content</div>
      </Grid>
    </Grid>
  ),
};

export const FormLayoutExample: Story = {
  render: () => (
    <Grid container columns={2} gap={4} className="max-w-xl mx-auto">
      <Grid item xs={2} md={1} className="bg-blue-100 p-4">First Name</Grid>
      <Grid item xs={2} md={1} className="bg-green-100 p-4">Last Name</Grid>
      <Grid item xs={2} md={1} className="bg-yellow-100 p-4">Email</Grid>
      <Grid item xs={2} md={1} className="bg-pink-100 p-4">Phone</Grid>
      <Grid item xs={2} className="bg-purple-100 p-4 text-center">Submit Button</Grid>
    </Grid>
  ),
};

export const FixedSidebarDashboard: Story = {
  render: () => (
    <div className="relative min-h-[400px] h-[400px] overflow-hidden">
      <div className="flex h-full">
        {/* Fixed Sidebar */}
        <div className="w-48 h-full bg-gray-800 text-white flex items-center justify-center sticky top-0 left-0 z-10">
          Fixed Sidebar
        </div>
        {/* Main Content */}
        <div className="flex-1 h-full overflow-y-auto">
          <Grid container columns={6} gap={4} className="h-full">
            <Grid item xs={6} className="bg-gray-200 p-4 mb-4 text-center">Header</Grid>
            <Grid item xs={6} className="bg-white p-4 text-center h-[300px] overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-blue-100 p-4">Main Content Block 1</div>
                <div className="bg-green-100 p-4">Main Content Block 2</div>
                <div className="bg-yellow-100 p-4">Main Content Block 3</div>
                <div className="bg-pink-100 p-4">Main Content Block 4</div>
                <div className="bg-purple-100 p-4">Main Content Block 5</div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  ),
}; 