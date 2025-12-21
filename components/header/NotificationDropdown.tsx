"use client";
import { BellIcon } from "@/icons/index";
import React, { useState, useRef, useEffect } from "react";

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 lg:h-11 lg:w-11"
        aria-label="Notifications"
      >
        <BellIcon />
        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-brand-400"></span>
          <span className="relative inline-flex w-2 h-2 rounded-full bg-brand-500"></span>
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
              Notifications
            </h3>
            <span className="px-2 py-0.5 text-xs font-medium text-brand-500 bg-brand-50 rounded-full dark:bg-brand-500/20 dark:text-brand-400">
              3 New
            </span>
          </div>
          <div className="p-2 max-h-96 overflow-y-auto custom-scrollbar">
            {/* Placeholder notifications */}
            <div className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                New booking received
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                John Doe booked Grand Hotel for 3 nights
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                2 minutes ago
              </p>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Payment confirmed
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Payment of $450 received for booking #12345
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                15 minutes ago
              </p>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                New user registered
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sarah Smith created a new account
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                1 hour ago
              </p>
            </div>
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <button className="w-full text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
