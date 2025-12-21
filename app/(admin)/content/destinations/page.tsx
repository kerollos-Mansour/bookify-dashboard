import React from "react";

export default function DestinationsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Destinations
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage featured destinations and their search configurations
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600">
          Add Destination
        </button>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Card */}
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
              Destination Title
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Category: Nature
            </p>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1.5 text-sm font-medium text-brand-500 bg-brand-50 rounded-lg hover:bg-brand-100 dark:bg-brand-500/20 dark:hover:bg-brand-500/30">
                Edit
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-error-500 bg-error-50 rounded-lg hover:bg-error-100 dark:bg-error-500/20 dark:hover:bg-error-500/30">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {/* TODO: Implement destinations grid with data from API */}
          No destinations to display. Add destinations to showcase popular
          travel locations.
        </p>
      </div>
    </div>
  );
}
