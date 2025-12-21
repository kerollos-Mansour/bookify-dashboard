import React from "react";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Categories
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage property categories like Beachfront, Cabins, Luxury, etc.
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600">
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder Category Cards */}
        {["Beachfront", "Cabins", "Luxury", "Budget"].map((category) => (
          <div
            key={category}
            className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                {category}
              </h3>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              -- properties
            </p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {/* TODO: Implement categories management with data from API */}
          Connect to API to load and manage categories.
        </p>
      </div>
    </div>
  );
}
