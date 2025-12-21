import apiClient from "./client";

// Content API endpoints (Destinations, Categories, Reviews)

export interface Destination {
  _id: string;
  title: string;
  photo: string;
  category: string;
  searchConfig: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  propertyCount: number;
}

export interface Review {
  _id: string;
  user: string;
  hotel: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export const contentApi = {
  // Destinations
  getAllDestinations: async () => {
    const response = await apiClient.get("/destinations");
    return response.data;
  },

  createDestination: async (data: Partial<Destination>) => {
    const response = await apiClient.post("/destinations", data);
    return response.data;
  },

  updateDestination: async (id: string, data: Partial<Destination>) => {
    const response = await apiClient.put(`/destinations/${id}`, data);
    return response.data;
  },

  deleteDestination: async (id: string) => {
    const response = await apiClient.delete(`/destinations/${id}`);
    return response.data;
  },

  // Categories
  getAllCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },

  createCategory: async (data: Partial<Category>) => {
    const response = await apiClient.post("/categories", data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },

  // Reviews
  getAllReviews: async (params?: {
    status?: Review["status"];
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get("/reviews", { params });
    return response.data;
  },

  approveReview: async (id: string) => {
    const response = await apiClient.patch(`/reviews/${id}/approve`);
    return response.data;
  },

  rejectReview: async (id: string) => {
    const response = await apiClient.patch(`/reviews/${id}/reject`);
    return response.data;
  },
};
