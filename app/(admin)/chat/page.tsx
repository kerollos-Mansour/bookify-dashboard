"use client";

import React from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import { useAuth } from "@/context/AuthContext";

export default function ChatPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Please log in to access chat.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Chat
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time communication with users
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="h-[calc(100vh-180px)] min-h-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <ChatInterface currentUser={user} />
      </div>
    </div>
  );
}
