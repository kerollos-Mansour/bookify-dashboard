import apiClient from "./client";

// Content API endpoints (Destinations, Categories, Reviews)

export interface Destination {
  _id: string;
  name: string;
  location?: string;
  price?: string;
  image?: string;
  categoryId?: string;
  category?: Category | string | null;
  searchConfig?: {
    location?: string;
    city?: string;
    minRate?: number;
  };
  bestSeller: boolean;
  rating: number;
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
  userid: {
    _id: string;
    username: string;
    email?: string;
  } | string | null;
  hotelid: {
    _id: string;
    name: string;
  } | string | null;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewDate?: string;
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
    return response.data.data.destinations;
  },

  createDestination: async (data: Partial<Destination>) => {
    const cleanedData = cleanPayload(data);
    console.log("Creating Destination Payload:", cleanedData);
    const response = await apiClient.post("/destinations", cleanedData);
    return response.data.data.destination;
  },

  updateDestination: async (id: string, data: Partial<Destination>) => {
    const cleanedData = cleanPayload(data);
    const response = await apiClient.patch(`/destinations/${id}`, cleanedData);
    return response.data.data.destination;
  },

  deleteDestination: async (id: string) => {
    const response = await apiClient.delete(`/destinations/${id}`);
    return response.data;
  },

  // Categories
  getAllCategories: async (includeInactive = false) => {
    const params = includeInactive ? { includeInactive: true } : {};
    const response = await apiClient.get("/categories", { params });
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
    const data = response.data;
    return { reviews: data.data, pagination: data.pagination || {} };
  },

  approveReview: async (id: string) => {
    const response = await apiClient.patch(`/reviews/${id}/approve`);
    return response.data.data.review;
  },

  rejectReview: async (id: string) => {
    const response = await apiClient.patch(`/reviews/${id}/reject`);
    return response.data.data.review;
  },

  // Image upload
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    if (response.data.status === 'success') {
      return response.data.data.imageUrl;
    }
    throw new Error(response.data.message || 'Upload failed');
  },
};
