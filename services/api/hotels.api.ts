import apiClient from "./client";

// Hotel API endpoints

export interface Hotel {
  _id: string;
  name: string;
  type: string;
  featured: boolean;
  images: string[];
  tripAdvisorRating: number;
  hotelDetails: string;
  hotelRating: number;
  propertyCategory: string;
  confidenceRating: number;
  lowRate: number;
  highRate: number;
  location?: {
    address: string;
    city: string;
    stateProvinceCode: string;
    countryCode: string;
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
  nightlyPrice?: number;
  totalRooms?: number;
}

export interface Amenity {
  _id: string;
  name: string;
  icon?: string;
  category?: string;
}

export interface RoomPrice {
  original: number;
  discounted?: number;
  discount?: number;
  currency: string;
}

export interface RoomRefundable {
  isRefundable: boolean;
  deadline?: string;
}

export interface Room {
  _id: string;
  hotelId: string | Hotel;
  name: string;
  images: string[];
  amenities: string[] | Amenity[];
  size?: string;
  sleeps: number;
  bedType: "single" | "double" | "queen" | "king" | "twin" | "full";
  allInclusive: boolean;
  bedrooms: number;
  status: "available" | "occupied" | "maintenance";
  refundable: RoomRefundable;
  price: RoomPrice;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetHotelsParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  sort?: string;
  city?: string;
  country?: string;
  minRate?: number;
  maxRate?: number;
  propertyCategory?: string;
}

export interface HotelsResponse {
  hotels: Hotel[];
  page: number;
  totalPages: number;
  totalHotels: number;
}

// Helper to remove empty strings and sensitive fields from payload
const cleanPayload = (obj: any, exclude: string[] = []) => {
  if (!obj || typeof obj !== 'object') return obj;

  const metadataFields = ['_id', '__v', 'createdAt', 'updatedAt', ...exclude];
  const cleaned: any = Array.isArray(obj) ? [] : {};

  Object.entries(obj).forEach(([key, value]) => {
    if (metadataFields.includes(key)){
      return;
    } 
    if (value === "" && key !== 'size'){
      return;
    } 
    if (value === null || value === undefined){
      return;
    }
    if (key === 'amenities' && Array.isArray(value)) {
      cleaned[key] = value.map((item: any) => item?._id || item);
      return;
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = cleanPayload(value);
      if (Object.keys(nested).length > 0) cleaned[key] = nested;
      return;
    }
    cleaned[key] = value;
  });

  return cleaned;
};

export const hotelsApi = {
  // Get all hotels with pagination and filtering
  getAllHotels: async (params?: GetHotelsParams): Promise<HotelsResponse> => {
    try {
      const response = await apiClient.get("/hotels", { params });
      return response.data.data;
    } catch (error: any) {
      console.error("getAllHotels failed", {
        params,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Get single hotel by ID
  getHotelById: async (id: string): Promise<Hotel> => {
    try {
      const response = await apiClient.get(`/hotels/${id}`);
      return response.data.data.hotel;
    } catch (error: any) {
      console.error("getHotelById failed", { id, status: error.response?.status, data: error.response?.data });
      throw error;
    }
  },

  // Create new hotel
  createHotel: async (data: Partial<Hotel>): Promise<Hotel> => {
    try {
      const response = await apiClient.post("/hotels", data);
      return response.data.data.hotel;
    } catch (error: any) {
      console.error("createHotel failed", { status: error.response?.status, data: error.response?.data });
      throw error;
    }
  },

  // Update hotel
  updateHotel: async (id: string, data: Partial<Hotel>): Promise<Hotel> => {
    try {
      const cleanedData = cleanPayload(data);
      const response = await apiClient.put(`/hotels/${id}`, cleanedData);
      return response.data.data.hotel;
    } catch (error: any) {
      console.error("updateHotel failed", { id, status: error.response?.status, data: error.response?.data });
      throw error;
    }
  },

  // Delete hotel
  deleteHotel: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/hotels/${id}`);
    } catch (error: any) {
      console.error("deleteHotel failed", {
        id,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Get rooms for a specific hotel
  getHotelRooms: async (hotelId: string): Promise<Room[]> => {
    try {
      const response = await apiClient.get(`/rooms/hotel/${hotelId}`);
      return response.data.data.rooms || response.data.data;
    } catch (error: any) {
      console.error("getHotelRooms failed", { hotelId, status: error.response?.status, data: error.response?.data });
      throw error;
    }
  },

  // Create new room
  createRoom: async (data: Partial<Room>): Promise<Room> => {
    try {
      const cleanedData = cleanPayload(data);
      const response = await apiClient.post("/rooms", cleanedData);
      return response.data.data.room;
    } catch (error: any) {
      console.error("createRoom failed", { status: error.response?.status, data: error.response?.data });
      throw error;
    }
  },

  // Update room
  updateRoom: async (id: string, data: Partial<Room>): Promise<Room> => {
    try {
      const cleanedData = cleanPayload(data, ['hotelId']);
      const response = await apiClient.put(`/rooms/${id}`, cleanedData);
      return response.data.data.room;
    } catch (error: any) {
      console.error("updateRoom failed", { id, status: error.response?.status, data: error.response?.data });
      throw error;
    }
  },

  // Delete room
  deleteRoom: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/rooms/${id}`);
    } catch (error: any) {
      console.error("deleteRoom failed", { id, status: error.response?.status, data: error.response?.data });
      throw error;
    }
  },

  // Get all amenities
  getAllAmenities: async (): Promise<Amenity[]> => {
    try {
      const response = await apiClient.get("/amenities");
      return response.data.data.amenities || response.data.data;
    } catch (error: any) {
      console.error("getAllAmenities failed", { status: error.response?.status, data: error.response?.data });
      throw error;
    }
  },
};
