import React from "react";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Reviews Moderation
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and moderate user-submitted reviews
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        <button className="px-4 py-2 text-sm font-medium text-brand-500 border-b-2 border-brand-500 whitespace-nowrap">
          Pending
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 whitespace-nowrap">
          Approved
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 whitespace-nowrap">
          Rejected
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {/* Placeholder Review Card */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-brand-500">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Grand Hotel • 2 days ago
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-warning-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                Review content placeholder...
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="px-3 py-1.5 text-sm font-medium text-success-600 bg-success-50 rounded-lg hover:bg-success-100 dark:bg-success-500/20 dark:text-success-400 dark:hover:bg-success-500/30">
                Approve
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 dark:bg-error-500/20 dark:text-error-400 dark:hover:bg-error-500/30">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {/* TODO: Implement reviews moderation with data from API */}
          No pending reviews to moderate.
        </p>
      </div>
    </div>
  );
}
