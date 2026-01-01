"use client";
import { User, usersApi } from "@/services/api";
import { getSettings, updateSettings } from "@/services/api/settings.api";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Tab = "admins" | "vendors" | "configuration";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("admins");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<{
    currency: string;
    maintenanceMode: boolean;
  }>({
    currency: "USD",
    maintenanceMode: false,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "", // Only for create
  });

  useEffect(() => {
    if (activeTab === "admins") {
      fetchUsers("admin");
    } else if (activeTab === "vendors") {
      fetchUsers("vendor");
    } else if (activeTab === "configuration") {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchUsers = async (role: "admin" | "vendor") => {
    setLoading(true);
    try {
      const res = await usersApi.getAllUsers({ role, limit: 100 });
      setUsers(res.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      setSettings(res.settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handeSaveSettings = async () => {
    try {
      await updateSettings(settings);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings.");
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await usersApi.createUser({
          ...formData,
          role: activeTab === "admins" ? "admin" : "vendor",
        });
        toast.success(
          `${activeTab === "admins" ? "Admin" : "Vendor"} created successfully!`
        );
      } else if (selectedUser._id) {
        await usersApi.updateUser(selectedUser._id, {
          name: formData.name,
          email: formData.email,
          username: formData.username,
        });
        toast.success("User updated successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchUsers(activeTab === "admins" ? "admin" : "vendor");
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user.");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", username: "", password: "" });
    setSelectedUser({});
  };

  const openEditModal = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      name: user.username || "", // simplified mapping
      email: user.email,
      username: user.username,
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await usersApi.deleteUser(id);
      fetchUsers(activeTab === "admins" ? "admin" : "vendor");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage system administrators, vendors, and global configuration.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("admins")}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "admins"
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Admins
        </button>
        <button
          onClick={() => setActiveTab("vendors")}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "vendors"
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Vendors
        </button>
        <button
          onClick={() => setActiveTab("configuration")}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "configuration"
              ? "border-brand-500 text-brand-600 dark:text-brand-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Configuration
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-900 dark:border-gray-800">
        {activeTab === "configuration" ? (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
              Site Configuration
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="mt-1 h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EGP">EGP (E£)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maintenance Mode
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Temporarily disable the site for maintenance
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    maintenanceMode: !settings.maintenanceMode,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode
                    ? "bg-brand-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="pt-4">
              <button
                onClick={handeSaveSettings}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                {activeTab === "admins"
                  ? "System Administrators"
                  : "Registered Vendors"}
              </h3>
              <button
                onClick={() => {
                  setModalMode("create");
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
              >
                Add {activeTab === "admins" ? "Admin" : "Vendor"}
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-brand-500">
                        <span className="text-sm font-medium">
                          {user.username.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1.5 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 dark:bg-error-500/20 dark:text-error-400 dark:hover:bg-error-500/30"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-sm text-center text-gray-500">
                    No {activeTab} found.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Simple Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {modalMode === "create"
                ? `Add New ${activeTab === "admins" ? "Admin" : "Vendor"}`
                : "Edit User"}
            </h3>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              {/* Name field mapped to businessName or name depending on requirement, simply name here */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              {modalMode === "create" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
                >
                  {modalMode === "create" ? "Create" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
