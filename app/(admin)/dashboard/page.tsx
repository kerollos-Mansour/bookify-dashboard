import React from "react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome to Bookify Admin Dashboard
        </p>
      </div>

      {/* KPI Cards Placeholder */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Revenue
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            --
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {/* TODO: Implement revenue calculation */}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Active Bookings
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            --
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {/* TODO: Implement active bookings count */}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Users
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            --
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {/* TODO: Implement users count */}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Hotels
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            --
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {/* TODO: Implement hotels count */}
          </p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
            Revenue Over Time
          </h3>
          <div className="flex items-center justify-center h-64 mt-4 text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {/* TODO: Implement revenue chart using ApexCharts or Recharts */}
            Chart Placeholder
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
            Bookings by Status
          </h3>
          <div className="flex items-center justify-center h-64 mt-4 text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {/* TODO: Implement bookings pie chart */}
            Chart Placeholder
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
          Recent Activity
        </h3>
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {/* TODO: Implement recent activity feed */}
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  );
}
