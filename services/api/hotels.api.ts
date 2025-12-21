import apiClient from "./client";

// Hotel API endpoints

export interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    address: string;
  };
  type: string;
  rating: number;
  images: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetHotelsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  city?: string;
}

export const hotelsApi = {
  // Get all hotels with pagination and filtering
  getAllHotels: async (params?: GetHotelsParams) => {
    const response = await apiClient.get("/hotels", { params });
    return response.data;
  },

  // Get single hotel by ID
  getHotelById: async (id: string) => {
    const response = await apiClient.get(`/hotels/${id}`);
    return response.data;
  },

  // Create new hotel
  createHotel: async (data: Partial<Hotel>) => {
    const response = await apiClient.post("/hotels", data);
    return response.data;
  },

  // Update hotel
  updateHotel: async (id: string, data: Partial<Hotel>) => {
    const response = await apiClient.put(`/hotels/${id}`, data);
    return response.data;
  },

  // Delete hotel
  deleteHotel: async (id: string) => {
    const response = await apiClient.delete(`/hotels/${id}`);
    return response.data;
  },

  // Get rooms for a specific hotel
  getHotelRooms: async (hotelId: string) => {
    const response = await apiClient.get(`/hotels/${hotelId}/rooms`);
    return response.data;
  },
};
