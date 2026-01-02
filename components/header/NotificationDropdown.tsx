"use client";
import { BellIcon } from "@/icons/index";
import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";

interface Notification {
  _id: string;
  type: "booking" | "promotion" | "update" | "message" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  // Socket.IO notification listeners
  useEffect(() => {
    if (!socket) return;

    // Join notification room and fetch history
    socket.emit("notification:join");

    const handleHistory = (history: Notification[]) => {
      console.log("Notification history received:", history);
      setNotifications(history);
    };

    const handleNewNotification = (notification: Notification) => {
      console.log("New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
    };

    const handleNotificationUpdated = (updated: {
      id: string;
      read: boolean;
    }) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === updated.id ? { ...n, read: updated.read } : n
        )
      );
    };

    const handleAllRead = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    socket.on("notification:history", handleHistory);
    socket.on("new_notification", handleNewNotification);
    socket.on("notification:updated", handleNotificationUpdated);
    socket.on("notification:all_read", handleAllRead);

    return () => {
      socket.off("notification:history", handleHistory);
      socket.off("new_notification", handleNewNotification);
      socket.off("notification:updated", handleNotificationUpdated);
      socket.off("notification:all_read", handleAllRead);
    };
  }, [socket]);

  const markAsRead = (id: string) => {
    if (socket) {
      socket.emit("notification:mark_read", id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 lg:h-11 lg:w-11"
        aria-label="Notifications"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-brand-400"></span>
            <span className="relative inline-flex w-2 h-2 rounded-full bg-brand-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium text-brand-500 bg-brand-50 rounded-full dark:bg-brand-500/20 dark:text-brand-400">
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="p-2 max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification._id}
                  onClick={() =>
                    !notification.read && markAsRead(notification._id)
                  }
                  className={`p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                    !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {getTimeAgo(notification.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
              <button className="w-full text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;