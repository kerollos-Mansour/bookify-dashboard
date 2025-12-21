import apiClient from "./client";

// Booking API endpoints

export interface Booking {
  _id: string;
  user: string;
  hotel: string;
  room: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface GetBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus?: "pending" | "paid" | "failed";
  startDate?: string;
  endDate?: string;
}

export const bookingsApi = {
  // Get all bookings with pagination and filtering
  getAllBookings: async (params?: GetBookingsParams) => {
    const response = await apiClient.get("/bookings", { params });
    return response.data;
  },

  // Get single booking by ID
  getBookingById: async (id: string) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id: string, status: Booking["status"]) => {
    const response = await apiClient.patch(`/bookings/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string) => {
    const response = await apiClient.patch(`/bookings/${id}/cancel`);
    return response.data;
  },
};
