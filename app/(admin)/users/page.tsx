"use client";
import { useState, useEffect } from "react";
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

  // Function to fetch all users
  const fetchUsers = async () => {
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
      } else if (response.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (response.data && response.data.users) {
        users = response.data.users;
      } else if (response.users) {
        users = response.users;
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
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingUser(null);
    setShowEditModal(false);
  };

  // Handle user update
  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setIsUpdating(true);
      
      // Call your backend API to update user
      // This assumes you have an updateUser method in your usersApi
      const response = await usersApi.updateUser(editingUser._id, {
        role: editingUser.role,
        isActive: editingUser.isActive,
      });
      
      // Update local state
      setAllUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === editingUser._id ? { ...user, ...editingUser } : user
        )
      );
      
      setFilteredUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === editingUser._id ? { ...user, ...editingUser } : user
        )
      );
      
      toast.success(`User ${editingUser.username} updated successfully!`, {
        duration: 3000,
        position: 'top-right',
        icon: '✅',
      });
      
      closeEditModal();
      
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(`Failed to update user: ${error.message || "Unknown error"}`, {
        duration: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle ban/unban user
  const toggleUserStatus = async (user: User) => {
    const newStatus = !user.isActive;
    const action = newStatus ? "banned" : "unbanned";
    
    try {
      const response = await usersApi.updateUser(user._id, {
        isActive: newStatus,
      });
      
      // Update local state
      setAllUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === user._id ? { ...u, isActive: newStatus } : u
        )
      );
      
      setFilteredUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === user._id ? { ...u, isActive: newStatus } : u
        )
      );
      
      toast.success(`User ${user.username} has been ${action}!`, {
        duration: 3000,
        position: 'top-right',
        icon: newStatus ? '✅' : '🚫',
      });
      
    } catch (error: any) {
      console.error(`Error ${action} user:`, error);
      toast.error(`Failed to ${action} user: ${error.message || "Unknown error"}`);
    }
  };

  // Filter users based on search input
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(allUsers);
      return;
    }
    
    const searchTerm = search.toLowerCase().trim();
    const filtered = allUsers.filter(user => 
      user.username?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.role?.toLowerCase().includes(searchTerm)
    );
    
    setFilteredUsers(filtered);
  }, [search, allUsers]);

  // Fetch on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Toaster 
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            User Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage all registered users, their roles, and account status
          </p>
        </div>

        {/* Connection Status */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Connection Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                  <button
                    onClick={fetchUsers}
                    className="mt-2 underline text-red-600 hover:text-red-500 dark:text-red-400"
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
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by username, email, or role..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Search Results Info */}
        {!loading && !error && search && (
          <div className="p-3 text-sm bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-300">
                Showing {filteredUsers.length} of {allUsers.length} users
                {search && ` for "${search}"`}
              </span>
              {search && filteredUsers.length === 0 && (
                <button
                  onClick={() => setSearch("")}
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
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
              <div className="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
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
                      Role
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            {search ? "No matching users found" : "No users available"}
                          </div>
                          <p className="mt-1 text-gray-500 dark:text-gray-400">
                            {search 
                              ? `No users match "${search}"` 
                              : "There are no users in the system"}
                          </p>
                          {search && (
                            <button
                              onClick={() => setSearch("")}
                              className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                            >
                              Clear search and show all users
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : user.role === 'moderator'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                            user.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}>
                            {user.isActive ? "Active" : "Banned"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="px-3 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user)}
                              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                user.isActive
                                  ? "text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                                  : "text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                              }`}
                            >
                              {user.isActive ? "Ban" : "Unban"}
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

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edit User: {editingUser.username}
                  </h3>
                  <button
                    onClick={closeEditModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      User Role
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['user', 'moderator', 'admin'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setEditingUser({...editingUser, role})}
                          className={`px-3 py-2 text-sm rounded-md transition-colors ${
                            editingUser.role === role
                              ? role === 'admin'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                : role === 'moderator'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                      ))}
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
                            checked={editingUser.isActive}
                            onChange={(e) => setEditingUser({
                              ...editingUser,
                              isActive: e.target.checked
                            })}
                          />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${
                            editingUser.isActive 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            editingUser.isActive 
                              ? 'transform translate-x-6' 
                              : ''
                          }`}></div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          {editingUser.isActive ? 'Active Account' : 'Banned Account'}
                        </span>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {editingUser.isActive 
                        ? 'User can login and use the system normally'
                        : 'User cannot login or access the system'}
                    </p>
                  </div>
                  
                  {/* User Info Display */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Username:</span>
                        <span className="font-medium">{editingUser.username}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Email:</span>
                        <span className="font-medium">{editingUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Joined:</span>
                        <span className="font-medium">
                          {new Date(editingUser.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateUser}
                      disabled={isUpdating}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        'Save Changes'
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