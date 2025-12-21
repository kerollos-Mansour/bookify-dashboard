import React from "react";

export default function FinancialsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Financials
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Revenue reports and financial analytics
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600">
            This Week
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
            Last Month
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
            Custom Range
          </button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Revenue
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            --
          </p>
          <p className="mt-1 text-xs text-success-600 dark:text-success-400">
            {/* TODO: Show percentage change */}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Completed Bookings
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            --
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Average Booking Value
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            --
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
          Recent Transactions
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Booking
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {/* TODO: Implement transactions table with data from API */}
                    No transactions to display.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Usage */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
          Coupon Usage Statistics
        </h3>
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {/* TODO: Implement coupon usage statistics */}
            No coupon data available.
          </p>
        </div>
      </div>
    </div>
  );
}
