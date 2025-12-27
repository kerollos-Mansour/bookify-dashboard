"use client";
import { useState, useEffect, useCallback } from "react";
import { usersApi, type User } from "@/services/api";
import { toast, Toaster } from "react-hot-toast";

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // NEW: States for reset password functionality
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Function to fetch all users with useCallback
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersApi.getAllUsers({
        page: 1,
        limit: 100,
      });

      let users: User[] = [];

      if (Array.isArray(response)) {
        users = response;
      } else if (response?.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (response?.data && response.data.users) {
        users = response.data.users;
      } else if (response?.users) {
        users = response.users;
      } else {
        console.warn("Unexpected response format:", response);
      }

      setAllUsers(users);
      setFilteredUsers(users);
    } catch (error: any) {
      console.error("Error fetching users:", error);

      if (error.message === "Network Error") {
        setError("Cannot connect to server. Make sure backend is running.");
      } else if (error.response?.status === 404) {
        setError("API endpoint not found.");
      } else {
        setError("Failed to load users. Please try again.");
      }

      toast.error("Failed to load users");
      setAllUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Open edit modal
  const openEditModal = useCallback((user: User) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  }, []);

  // Close edit modal
  const closeEditModal = useCallback(() => {
    setEditingUser(null);
    setShowEditModal(false);
  }, []);

  // NEW: Open reset password modal
  const openResetPasswordModal = useCallback((userId: string, userName: string) => {
    setSelectedUserId(userId);
    setEditingUser({ _id: userId, name: userName } as User);
    setShowResetPasswordModal(true);
    setPasswordData({ newPassword: "", confirmPassword: "" });
  }, []);

  // NEW: Close reset password modal
  const closeResetPasswordModal = useCallback(() => {
    setSelectedUserId(null);
    setShowResetPasswordModal(false);
    setPasswordData({ newPassword: "", confirmPassword: "" });
  }, []);

  // UPDATED: Handle user update - now includes name, email, phone number
  const handleUpdateUser = useCallback(async () => {
    if (!editingUser) return;

    try {
      setIsUpdating(true);

      // UPDATED: Prepare update data with name, email, phone number
      const updateData = {
        name: editingUser.name,
        email: editingUser.email,
        phoneNo: editingUser.phoneNo,
        isBlocked: editingUser.isBlocked,
      };

      // Update user via API
      await usersApi.updateUser(editingUser._id, updateData);

      // Update local state
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUser._id ? { ...user, ...editingUser } : user
        )
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUser._id ? { ...user, ...editingUser } : user
        )
      );

      toast.success(`User ${editingUser.name} updated successfully!`, {
        duration: 3000,
        position: "top-right",
      });

      closeEditModal();
    } catch (error: any) {
      console.error("Error updating user:", error);
      const errorMessage = error.message || "Unknown error";
      toast.error(`Failed to update user: ${errorMessage}`, {
        duration: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  }, [editingUser, closeEditModal]);

  // NEW: Handle password reset
  const handleResetPassword = useCallback(async () => {
    if (!selectedUserId || !passwordData.newPassword) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    try {
      setIsResettingPassword(true);

      // Call reset password API
      await usersApi.resetPassword(selectedUserId, {
        newPassword: passwordData.newPassword,
      });

      toast.success("Password reset successfully!", {
        duration: 3000,
        position: "top-right",
      });

      closeResetPasswordModal();
    } catch (error: any) {
      console.error("Error resetting password:", error);
      const errorMessage = error.message || "Unknown error";
      toast.error(
        `Failed to reset password: ${errorMessage}`,
        {
          duration: 4000,
        }
      );
    } finally {
      setIsResettingPassword(false);
    }
  }, [selectedUserId, passwordData, closeResetPasswordModal]);

  const toggleUserStatus = useCallback(async (user: User) => {
    const newStatus = !user.isBlocked; // Toggle the status
    const action = newStatus ? "banned" : "unbanned";

    try {
      await usersApi.updateUser(user._id, {
        isBlocked: newStatus,
      });

      // Update local state
      setAllUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, isBlocked: newStatus } : u
        )
      );

      setFilteredUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, isBlocked: newStatus } : u
        )
      );

      toast.success(`User ${user.name} has been ${action}!`, {
        duration: 3000,
        position: "top-right",
      });
    } catch (error: any) {
      console.error(`Error ${action} user:`, error);
      const errorMessage = error.message || "Unknown error";
      toast.error(`Failed to ${action} user: ${errorMessage}`);
    }
  }, []);

  // Filter users based on search input
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(allUsers);
      return;
    }

    const searchTerm = search.toLowerCase().trim();
    const filtered = allUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.phoneNo?.toLowerCase().includes(searchTerm)
    );

    setFilteredUsers(filtered);
  }, [search, allUsers]);

  // Fetch on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearch("");
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  // UPDATED: Handle field changes in modal (name, email, phone number)
  const handleFieldChange = useCallback((field: keyof User, value: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [field]: value });
    }
  }, [editingUser]);

  // Handle status change in modal
  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (editingUser) {
        setEditingUser({
          ...editingUser,
          isBlocked: !e.target.checked,
        });
      }
    },
    [editingUser]
  );

  // NEW: Handle password input change
  const handlePasswordChange = useCallback((field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "8px",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            User Management
          </h1>
          {/* UPDATED: Description to include password reset */}
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Manage all registered users, account status, and reset passwords
          </p>
        </div>

        {/* Connection Status */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/30 dark:border-red-800">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Connection Error
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-2 underline text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
              value={search}
              onChange={handleSearchChange}
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Search Results Info */}
        {!loading && !error && search && (
          <div className="p-3 text-sm bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/30 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-300">
                Showing {filteredUsers.length} of {allUsers.length} users
                {search && ` for "${search}"`}
              </span>
              {search && filteredUsers.length === 0 && (
                <button
                  onClick={handleClearSearch}
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin dark:border-blue-800 dark:border-t-blue-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading users...
              </p>
            </div>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      User
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Email
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            {search
                              ? "No matching users found"
                              : "No users available"}
                          </div>
                          <p className="mt-1 text-gray-500 dark:text-gray-400">
                            {search
                              ? `No users match "${search}"`
                              : "There are no users in the system"}
                          </p>
                          {search && (
                            <button
                              onClick={handleClearSearch}
                              className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Clear search and show all users
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {user.phoneNo || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                              user.isBlocked
                                ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            }`}
                          >
                            {user.isBlocked ? "Banned" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              Edit
                            </button>
                            {/* NEW: Reset Password Button */}
                            <button
                              onClick={() => openResetPasswordModal(user._id, user.name)}
                              className="px-3 py-1.5 text-xs text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 transition-colors"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user)}
                              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                                user.isBlocked
                                  ? "text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                                  : "text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                              }`}
                            >
                              {user.isBlocked ? "Unban" : "Ban"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UPDATED: Edit User Modal with editable fields */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Shadow backdrop */}
            <div
              className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/20 backdrop-blur-[2px] transition-opacity"
              onClick={closeEditModal}
            ></div>

            {/* Modal card with shadow */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl shadow-gray-900/20 dark:shadow-gray-900/50 ring-1 ring-gray-200 dark:ring-gray-700 transform transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Edit User: {editingUser.name}
                  </h3>
                  <button
                    onClick={closeEditModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* NEW: Editable Fields Section */}
                  <div className="space-y-3">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editingUser.name || ""}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingUser.email || ""}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editingUser.phoneNo || ""}
                        onChange={(e) => handleFieldChange("phoneNo", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                  </div>

                  {/* Account Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Status
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={!editingUser.isBlocked}
                            onChange={handleStatusChange}
                          />
                          <div
                            className={`block w-12 h-6 rounded-full transition-colors ${
                              !editingUser.isBlocked
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <div
                            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                              !editingUser.isBlocked
                                ? "transform translate-x-6"
                                : ""
                            }`}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          {!editingUser.isBlocked
                            ? "Active Account"
                            : "Banned Account"}
                        </span>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {!editingUser.isBlocked
                        ? "User can login and use the system normally"
                        : "User cannot login or access the system"}
                    </p>
                  </div>

                  {/* Additional Info Display (Read-only) */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500 dark:text-gray-400">
                          User ID:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                          {editingUser._id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Joined:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {editingUser.createdAt
                            ? new Date(
                                editingUser.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateUser}
                      disabled={isUpdating}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Reset Password Modal */}
        {showResetPasswordModal && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Shadow backdrop */}
            <div
              className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/20 backdrop-blur-[2px] transition-opacity"
              onClick={closeResetPasswordModal}
            ></div>

            {/* Modal card with shadow */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl shadow-gray-900/20 dark:shadow-gray-900/50 ring-1 ring-gray-200 dark:ring-gray-700 transform transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Reset Password for {editingUser.name}
                  </h3>
                  <button
                    onClick={closeResetPasswordModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Warning Message */}
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-yellow-500 mt-0.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        This will reset the user s password immediately. They will need to use this new password to login.
                      </div>
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Minimum 6 characters required
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Password Match Indicator */}
                  {passwordData.newPassword && passwordData.confirmPassword && (
                    <div className={`p-2 rounded-md text-sm ${
                      passwordData.newPassword === passwordData.confirmPassword
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                    }`}>
                      {passwordData.newPassword === passwordData.confirmPassword
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={closeResetPasswordModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                      disabled={isResettingPassword}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={isResettingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      {isResettingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Resetting...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}