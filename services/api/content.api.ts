import apiClient from "./client";

// Content API endpoints (Destinations, Categories, Reviews)

export interface Destination {
  _id: string;
  name: string;
  location: string;
  price: string;
  image?: string;
  categoryId?: string;
  category?: Category | string;
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

// Helper to transform frontend data to backend schema
const transformForBackend = (data: Partial<Destination>) => {
  const transformed: any = { ...data };
  const searchConfig: any = {};

  if (transformed.location) {
    searchConfig.location = transformed.location;
    delete transformed.location;
  }

  if (transformed.price) {
    // Extract number from price string (e.g., "$1000" -> 1000)
    const priceNum = parseFloat(String(transformed.price).replace(/[^0-9.]/g, ''));
    if (!isNaN(priceNum)) {
      searchConfig.minRate = priceNum;
    }
    delete transformed.price;
  }

  // If we built a searchConfig, assign it
  if (Object.keys(searchConfig).length > 0) {
    transformed.searchConfig = {
      ...transformed.searchConfig, // preserve existing if any
      ...searchConfig
    };
  }

  return transformed;
};

// Helper to map backend schema to frontend fields
const transformFromBackend = (data: any): Destination => {
  if (!data) return data;

  let categoryId = data.categoryId;

  // If categoryId is an object (populated), extract its _id
  if (categoryId && typeof categoryId === 'object' && (categoryId as any)._id) {
    categoryId = (categoryId as any)._id;
  }

  // If no categoryId found yet, look at data.category
  if (!categoryId && data.category) {
    if (typeof data.category === 'string') {
      categoryId = data.category;
    } else if (typeof data.category === 'object' && (data.category as any)._id) {
      categoryId = (data.category as any)._id;
    }
  }

  return {
    ...data,
    categoryId,
    // Map nested searchConfig fields to top-level if missing
    location: data.searchConfig?.location || data.location || data.searchConfig?.city || '',
    price: data.searchConfig?.minRate ? String(data.searchConfig.minRate) : (data.price || ''),
  };
};

export const contentApi = {
  // Destinations
  getAllDestinations: async () => {
    const response = await apiClient.get("/destinations");
    return response.data.data.destinations.map(transformFromBackend);
  },

  createDestination: async (data: Partial<Destination>) => {
    const transformedData = transformForBackend(data);
    const cleanedData = cleanPayload(transformedData);
    console.log("Creating Destination Payload:", cleanedData);
    const response = await apiClient.post("/destinations", cleanedData);
    return transformFromBackend(response.data.data.destination);
  },

  updateDestination: async (id: string, data: Partial<Destination>) => {
    const transformedData = transformForBackend(data);
    const cleanedData = cleanPayload(transformedData);
    const response = await apiClient.patch(`/destinations/${id}`, cleanedData);
    return transformFromBackend(response.data.data.destination);
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
