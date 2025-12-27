import apiClient from "./client";

// User API endpoints

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  role: "user" | "admin";
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  phoneNo?: string;
  role?: "user" | "admin";
  isBlocked?: boolean;
}

// NEW: Interface for reset password data
export interface ResetPasswordData {
  newPassword: string;
}

export const usersApi = {
  // Get all users with pagination and filtering
  getAllUsers: async (params?: GetUsersParams) => {
    const response = await apiClient.get("/users", { params });
    return response.data;
  },

  // Get single user by ID
  getUserById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (data: Partial<User>) => {
    const response = await apiClient.post("/users", data);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Ban/Unban user
  toggleUserStatus: async (id: string) => {
    const response = await apiClient.patch(`/users/${id}/toggle-status`);
    return response.data;
  },

  // NEW: Reset user password
  resetPassword: async (id: string, data: ResetPasswordData) => {
    const response = await apiClient.post(`/users/${id}/reset-password`, data);
    return response.data;
  },

  // OPTIONAL: Add a dedicated endpoint for admin to reset password
  // This might be different from the regular reset-password endpoint
  adminResetPassword: async (id: string, data: ResetPasswordData) => {
    const response = await apiClient.post(`/users/${id}/admin-reset-password`, data);
    return response.data;
  },
};