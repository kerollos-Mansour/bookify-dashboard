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

// ✅ FIX 1: Add explicit return type annotation
const cleanPayload = (
  obj: Record<string, unknown> | unknown[] | null | undefined,
  exclude: string[] = []
): Record<string, unknown> | unknown[] | null | undefined => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj
      .map((item) =>
        cleanPayload(item as Record<string, unknown> | unknown[], exclude)
      )
      .filter((item): item is Record<string, unknown> => item !== undefined);
  }

  const metadataFields = ["_id", "__v", "createdAt", "updatedAt", ...exclude];
  const cleaned: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (metadataFields.includes(key)) return;
    if (value === "" && key !== "size") return;
    if (value === null || value === undefined) return;

    if (key === "amenities" && Array.isArray(value)) {
      cleaned[key] = value.map((item: unknown) => {
        if (item && typeof item === "object" && "_id" in item) {
          return (item as { _id: string })._id;
        }
        return item;
      });
      return;
    }

    if (typeof value === "object") {
      const nested = cleanPayload(
        value as Record<string, unknown> | unknown[],
        exclude
      );
      if (nested !== null && nested !== undefined) {
        if (
          Array.isArray(nested)
            ? nested.length > 0
            : Object.keys(nested).length > 0
        ) {
          cleaned[key] = nested;
        }
      }
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
};

// ✅ FIX 2: Add type assertion in extractData
const extractData = <T>(response: { data?: { data?: T } & T } & { data?: T }, key?: string): T => {
  const data = (response.data as { data?: T })?.data || response.data;
  if (key) {
    return ((data as Record<string, unknown>)?.[key] || data) as T;
  }
  return data as T;
};

// ✅ FIX 3: Add ApiError interface for error handling
interface ApiError {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
}

export const hotelsApi = {
  // Get all hotels with pagination and filtering
  getAllHotels: async (params?: GetHotelsParams): Promise<HotelsResponse> => {
    try {
      const response = await apiClient.get("/hotels", { params });
      const data = extractData<HotelsResponse>(response);

      // Ensure we return a valid HotelsResponse structure
      return {
        hotels: data?.hotels || [],
        page: data?.page || 1,
        totalPages: data?.totalPages || 1,
        totalHotels: data?.totalHotels || 0,
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("getAllHotels failed", {
        params,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },

  // Get single hotel by ID
  getHotelById: async (id: string): Promise<Hotel> => {
    try {
      const response = await apiClient.get(`/hotels/${id}`);
      return extractData<Hotel>(response, "hotel");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("getHotelById failed", {
        id,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },

  // Create new hotel
  createHotel: async (data: Partial<Hotel>): Promise<Hotel> => {
    try {
      const response = await apiClient.post("/hotels", data);
      return extractData<Hotel>(response, "hotel");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("createHotel failed", {
        payload: data,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },

  // Update hotel
  updateHotel: async (id: string, data: Partial<Hotel>): Promise<Hotel> => {
    try {
      const cleanedData = cleanPayload(data as Record<string, unknown>);
      const response = await apiClient.put(`/hotels/${id}`, cleanedData);
      return extractData<Hotel>(response, "hotel");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("updateHotel failed", {
        id,
        payload: data,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },

  // Delete hotel
  deleteHotel: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/hotels/${id}`);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("deleteHotel failed", {
        id,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },

  // Get rooms for a specific hotel
  getHotelRooms: async (hotelId: string): Promise<Room[]> => {
    try {
      const response = await apiClient.get(`/rooms/hotel/${hotelId}`);
      const data = extractData<{ rooms?: Room[] } | Room[]>(response);
      return (data as { rooms?: Room[] })?.rooms || (data as Room[]) || [];
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("getHotelRooms failed", {
        hotelId,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },

  // Create new room
  createRoom: async (data: Partial<Room>): Promise<Room> => {
    try {
      const cleanedData = cleanPayload(data as Record<string, unknown>);
      const response = await apiClient.post("/rooms", cleanedData);
      return extractData<Room>(response, "room");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("createRoom failed", {
        payload: data,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },

  // Update room
  updateRoom: async (id: string, data: Partial<Room>): Promise<Room> => {
    try {
      const cleanedData = cleanPayload(data as Record<string, unknown>, [
        "hotelId",
      ]);
      const response = await apiClient.put(`/rooms/${id}`, cleanedData);
      return extractData<Room>(response, "room");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("updateRoom failed", {
        id,
        payload: data,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },

  // Delete room
  deleteRoom: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/rooms/${id}`);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("deleteRoom failed", {
        id,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },

  // Get all amenities
  getAllAmenities: async (): Promise<Amenity[]> => {
    try {
      const response = await apiClient.get("/amenities");
      const data = extractData<{ amenities?: Amenity[] } | Amenity[]>(response);
      return (
        (data as { amenities?: Amenity[] })?.amenities ||
        (data as Amenity[]) ||
        []
      );
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("getAllAmenities failed", {
        status: apiError.response?.status,
        responseData: apiError.response?.data,
      });
      throw error;
    }
  },
};