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

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page?: number;
    totalPages?: number;
    total?: number;
  };
}

const extractData = <T>(response: any, key?: string): T => {
  const data = response.data?.data || response.data;
  
  if (key && data) {
    return data[key] ?? data;
  }
  return data;
};

const cleanPayload = <T extends object>(data: Partial<T>): Partial<T> => {
  const cleaned: Partial<T> = { ...data };
  const fieldsToRemove = ["_id", "__v", "createdAt", "updatedAt"];

  Object.keys(cleaned).forEach((key) => {
    const k = key as keyof T;
    
    if (fieldsToRemove.includes(key)) {
      delete cleaned[k];
    }
    else if (cleaned[k] === "") {
      delete cleaned[k];
    }
    else if (cleaned[k] === null || cleaned[k] === undefined) {
      delete cleaned[k];
    }
  });

  return cleaned;
};

export const contentApi = {
  // ==================== Destinations ====================
  
  getAllDestinations: async (): Promise<Destination[]> => {
    try {
      const response = await apiClient.get("/destinations");
      const data = extractData<any>(response);
      return data?.destinations || data || [];
    } catch (error: any) {
      console.error("getAllDestinations failed", {
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  getDestinationById: async (id: string): Promise<Destination> => {
    try {
      const response = await apiClient.get(`/destinations/${id}`);
      return extractData<Destination>(response, "destination");
    } catch (error: any) {
      console.error("getDestinationById failed", {
        id,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  createDestination: async (data: Partial<Destination>): Promise<Destination> => {
    try {
      const cleanedData = cleanPayload(data);
      console.log("Creating Destination Payload:", cleanedData);
      const response = await apiClient.post("/destinations", cleanedData);
      return extractData<Destination>(response, "destination");
    } catch (error: any) {
      console.error("createDestination failed", {
        payload: data,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  updateDestination: async (id: string, data: Partial<Destination>): Promise<Destination> => {
    try {
      const cleanedData = cleanPayload(data);
      const response = await apiClient.patch(`/destinations/${id}`, cleanedData);
      return extractData<Destination>(response, "destination");
    } catch (error: any) {
      console.error("updateDestination failed", {
        id,
        payload: data,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  deleteDestination: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/destinations/${id}`);
    } catch (error: any) {
      console.error("deleteDestination failed", {
        id,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  // ==================== Categories ====================

  getAllCategories: async (includeInactive = false): Promise<Category[]> => {
    try {
      const params = includeInactive ? { includeInactive: true } : {};
      const response = await apiClient.get("/categories", { params });
      const data = extractData<any>(response);
      return data?.categories || data || [];
    } catch (error: any) {
      console.error("getAllCategories failed", {
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  getCategoryById: async (id: string): Promise<Category> => {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return extractData<Category>(response, "category");
    } catch (error: any) {
      console.error("getCategoryById failed", {
        id,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    try {
      const cleanedData = cleanPayload(data);
      const response = await apiClient.post("/categories", cleanedData);
      return extractData<Category>(response, "category");
    } catch (error: any) {
      console.error("createCategory failed", {
        payload: data,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    try {
      const cleanedData = cleanPayload(data);
      const response = await apiClient.patch(`/categories/${id}`, cleanedData);
      return extractData<Category>(response, "category");
    } catch (error: any) {
      console.error("updateCategory failed", {
        id,
        payload: data,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error: any) {
      console.error("deleteCategory failed", {
        id,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  // ==================== Reviews ====================

  getAllReviews: async (params?: {
    status?: Review["status"];
    page?: number;
    limit?: number;
  }): Promise<ReviewsResponse> => {
    try {
      const response = await apiClient.get("/reviews", { params });
      const rawData = response.data;
      
      // Handle different response structures
      const data = rawData?.data || rawData;
      const reviews = data?.reviews || (Array.isArray(data) ? data : []);
      const pagination = rawData?.pagination || data?.pagination || {};
      
      return { reviews, pagination };
    } catch (error: any) {
      console.error("getAllReviews failed", {
        params,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      // Return empty data instead of throwing to prevent UI crashes
      return { reviews: [], pagination: {} };
    }
  },

  getReviewById: async (id: string): Promise<Review> => {
    try {
      const response = await apiClient.get(`/reviews/${id}`);
      return extractData<Review>(response, "review");
    } catch (error: any) {
      console.error("getReviewById failed", {
        id,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  approveReview: async (id: string): Promise<Review> => {
    try {
      const response = await apiClient.patch(`/reviews/${id}/approve`);
      return extractData<Review>(response, "review");
    } catch (error: any) {
      console.error("approveReview failed", {
        id,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  rejectReview: async (id: string): Promise<Review> => {
    try {
      const response = await apiClient.patch(`/reviews/${id}/reject`);
      return extractData<Review>(response, "review");
    } catch (error: any) {
      console.error("rejectReview failed", {
        id,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  deleteReview: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/reviews/${id}`);
    } catch (error: any) {
      console.error("deleteReview failed", {
        id,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },

  // ==================== Image Upload ====================

  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await apiClient.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      // Handle different response structures
      const data = response.data?.data || response.data;
      
      if (response.data?.status === "success" || data?.imageUrl) {
        return data.imageUrl;
      }
      
      throw new Error(response.data?.message || "Upload failed");
    } catch (error: any) {
      console.error("uploadImage failed", {
        fileName: file.name,
        fileSize: file.size,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      throw error;
    }
  },
};