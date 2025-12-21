import React from "react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage admin accounts and site configuration
        </p>
      </div>

      {/* Admin Accounts Section */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
            Admin Accounts
          </h3>
          <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600">
            Add Admin
          </button>
        </div>
        <div className="space-y-3">
          {/* Placeholder Admin Card */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-brand-500">
                <span className="text-sm font-medium">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  admin@bookify.com
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
                Edit
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 dark:bg-error-500/20 dark:text-error-400 dark:hover:bg-error-500/30">
                Remove
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {/* TODO: Load admin accounts from API */}
          </p>
        </div>
      </div>

      {/* Site Configuration Section */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
          Site Configuration
        </h3>
        <div className="space-y-4">
          {/* Currency Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Default Currency
            </label>
            <select className="mt-1 h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maintenance Mode
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Temporarily disable the site for maintenance
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
            </button>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600">
              Save Changes
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {/* TODO: Implement site configuration save functionality */}
          </p>
        </div>
      </div>
    </div>
  );
}
