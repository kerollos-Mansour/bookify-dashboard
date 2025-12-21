import React from "react";

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Room Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage room types, pricing, and availability
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600">
          Add Room
        </button>
      </div>

      {/* Hotel Selector and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <select className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90">
            <option>Select Hotel</option>
            {/* TODO: Populate with hotel list from API */}
          </select>
          <select className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90">
            <option>All Status</option>
            <option>Available</option>
            <option>Maintenance</option>
            <option>Occupied</option>
          </select>
        </div>
      </div>

      {/* Table Placeholder */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Room Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Type
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Price
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Quantity
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Sleeps
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {/* TODO: Implement rooms table with data from API */}
                    No rooms to display. Select a hotel to view rooms.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
