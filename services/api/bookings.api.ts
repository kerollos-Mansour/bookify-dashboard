import apiClient from "./client";

// Booking API endpoints - Updated to match your backend

export interface Booking {
  _id: string;
  userId: {
    name: string;
    username: string,
    email: string,
    phoneNo: string
  } | null;
  hotelId: {
    name: string;
    location: {
      address: string,
      city: string,
      countryCode: string
    };
  } | null;
  roomId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  subTotal: number;
  totalPrice: number;
  guests: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  couponId: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentIntentId: string;
  createdAt: string;
  fees: number;
  updatedAt: string;
  bookingNumber: string
}

interface BookingFormData {
    status: "pending" | "confirmed" | "cancelled" | "completed";
    paymentStatus: "pending" | "paid" | "unpaid" | "failed";
    paymentMethod: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    pricePerNight: number;
    fees: number;
}

export interface GetBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  searchBy: "Booking Number" | "User Name" | "Hotel Name";
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus?: "pending" | "paid" | "unpaid" | "failed";
  startDate?: string;
  endDate?: string;
}

export const bookingsApi = {
  // Get all bookings (Admin only)
  getAllBookings: async (params?: GetBookingsParams) => {
    const response = await apiClient.get("/bookings", { params });
    return response.data;
  },

  // Get single booking by ID
  getBookingById: async (id: string) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  // Get user's own bookings
  getUserBookings: async () => {
    const response = await apiClient.get("/bookings/my-bookings");
    return response.data;
  },

  // Create new booking
  createBooking: async (data: Partial<Booking>) => {
    const response = await apiClient.post("/bookings", data);
    return response.data;
  },

  // Update booking status (Admin only)
  updateBookingStatus: async (id: string, status: Booking["status"]) => {
    const response = await apiClient.put(`/bookings/${id}/status`, { status });
    return response.data;
  },
  updateBooking: async (id: string, newData: BookingFormData) => {
    const response = await apiClient.put(`/bookings/${id}`, { newData });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string) => {
    const response = await apiClient.put(`/bookings/${id}/cancel`);
    return response.data;
  },
};
