import apiClient from "./client";

// Content API endpoints (Destinations, Categories, Reviews)

export interface Destination {
  _id: string;
  name: string;
  location: string;
  price: string;
  image?: string;
  categoryId?: string;
  bestSeller: boolean;
  rating: number;
  address?: string;
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

// Helper to remove empty strings from payload
const cleanPayload = (data: Partial<Destination>) => {
  const cleaned: Partial<Destination> = { ...data };
  Object.keys(cleaned).forEach((key) => {
    const k = key as keyof Destination;
    if (cleaned[k] === "") {
      delete cleaned[k];
    }
  });
  return cleaned;
};

export const contentApi = {
  // Destinations
  getAllDestinations: async () => {
    const response = await apiClient.get("/destinations");
    return response.data.data;
  },

  createDestination: async (data: Partial<Destination>) => {
    const cleanedData = cleanPayload(data);
    console.log("Creating Destination Payload:", cleanedData);
    const response = await apiClient.post("/destinations", cleanedData);
    return response.data.data;
  },

  updateDestination: async (id: string, data: Partial<Destination>) => {
    const cleanedData = cleanPayload(data);
    const response = await apiClient.put(`/destinations/${id}`, cleanedData);
    return response.data.data;
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
