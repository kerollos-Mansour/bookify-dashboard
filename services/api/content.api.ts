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
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
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
const cleanPayload = <T extends object>(data: Partial<T>) => {
  const cleaned: Partial<T> = { ...data };
  const fieldsToRemove = ["_id", "__v", "createdAt", "updatedAt"];

  Object.keys(cleaned).forEach((key) => {
    const k = key as keyof T;
    // Remove if field is listed as immutable/internal
    if (fieldsToRemove.includes(key)) {
      delete cleaned[k];
    }
    // Remove if value is explicitly empty string, but keep 0 and false
    else if (cleaned[k] === "") {
      delete cleaned[k];
    }
    // Remove null or undefined to avoid backend validation errors
    else if (cleaned[k] === null || cleaned[k] === undefined) {
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
     return response.data.data.categories;
  },

  getCategoryById: async (id: string) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data.category;
  },

  createCategory: async (data: Partial<Category>) => {
    const cleanedData = cleanPayload(data);
    const response = await apiClient.post("/categories", cleanedData);
    return response.data.data;
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    const cleanedData = cleanPayload(data);
    const response = await apiClient.patch(`/categories/${id}`, cleanedData);
    return response.data.data.category;
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
