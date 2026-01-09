"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "../../config/api.config";

export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}

interface ActiveUser {
  userId: string;
  username?: string;
  socketId?: string;
}

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  seen?: boolean;
}

interface ChatInterfaceProps {
  currentUser: User;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log(currentUser);

  // Initialize Socket.io
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found. Please log in.");
      return;
    }

    const socketInstance = io(API_CONFIG.SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Connection error:", error.message);
      setIsConnected(false);

      if (
        error.message.includes("token") ||
        error.message.includes("Authentication")
      ) {
        localStorage.removeItem("authToken");
      }
    });

    // ✅ Type the users parameter
    socketInstance.on("update_user_list", (users: ActiveUser[]) => {
      setActiveUsers(users.filter((u) => u.userId !== currentUser.id));
    });

    socketInstance.on("chat:message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("chat:history", (history: Message[]) => {
      setMessages(history);
    });

    socketInstance.on(
      "chat:typing",
      ({ userId, isTyping: typing }: { userId: string; isTyping: boolean }) => {
        if (userId !== selectedUser?.id) return;
        setIsTyping(typing);
      }
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUser || !socket) return;

    socket.emit("chat:message", {
      receiverId: selectedUser.id,
      content: inputText,
    });

    setInputText("");
  };

  // ✅ FIX 2: Use ActiveUser type instead of any
  const handleUserSelect = (user: ActiveUser) => {
    setSelectedUser({
      id: user.userId,
      username: user.username || "Unknown",
      email: "",
    });

    if (socket) {
      socket.emit("chat:join", { receiverId: user.userId });
    }

    setMessages([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (selectedUser && socket) {
      socket.emit("chat:typing", {
        receiverId: selectedUser.id,
        isTyping: true,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("chat:typing", {
          receiverId: selectedUser.id,
          isTyping: false,
        });
      }, 3000);
    }
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Sidebar - User List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Active Users
          </h2>
          <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {isConnected ? "Online" : "Offline"}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No active users</div>
          ) : (
            activeUsers.map((user) => (
              <button
                key={user.userId}
                onClick={() => handleUserSelect(user)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  selectedUser?.id === user.userId
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                  {(user.username || "U")[0].toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {user.username || "User"}
                  </div>
                  <div className="text-xs text-green-500">Online</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-800 z-10">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {(selectedUser.username || "?")[0].toUpperCase()}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {selectedUser.username}
              </h3>
              {isTyping && (
                <span className="text-xs text-gray-400 italic">typing...</span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p>Start a conversation with {selectedUser.username}</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isOwn = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                          isOwn
                            ? "bg-brand-600 text-white rounded-br-none"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span
                          className={`text-[10px] block mt-1 ${
                            isOwn ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </div>
            <p className="text-lg font-medium">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
