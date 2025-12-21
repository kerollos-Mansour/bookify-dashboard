"use client";
import React from "react";

const SidebarWidget: React.FC = () => {
  return (
    <div className="p-4 mt-6 mb-6 rounded-lg bg-gray-100 dark:bg-gray-800">
      <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Quick Stats
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Widget area - customize as needed
      </p>
    </div>
  );
};

export default SidebarWidget;
