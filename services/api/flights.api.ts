import apiClient from "./client";


export interface Flight {
  _id: string;
  airline: string;
  flightNumber: string;
  aircraft?: string;
  departure: {
    airport: {
      code: string;
      name: string;
      city: string;
      country: string;
    };
    dateTime: string;
    terminal?: string;
  };
  arrival: {
    airport: {
      code: string;
      name: string;
      city: string;
      country: string;
    };
    dateTime: string;
    terminal?: string;
  };
  duration: number;
  stops: number;
  pricing: {
    economy: { available: boolean; price: number; availableSeats: number };
    business: { available: boolean; price: number; availableSeats: number };
    firstClass: { available: boolean; price: number; availableSeats: number };
  };
  status: "scheduled" | "delayed" | "cancelled" | "completed";
  amenities?: string[];
  featured?: boolean;
  ownerId?: string;
}

export interface GetFlightsParams {
  page?: number;
  limit?: number;
  origin?: string;
  destination?: string;
  airline?: string;
  status?: string;
  featured?: boolean;
  departureDate?: string;
}

export const flightsApi = {
  getAllFlights: async (params: GetFlightsParams = {}) => {
    const response = await apiClient.get("/flights", { params });
    return response.data;
  },

  getFlightById: async (id: string) => {
    const response = await apiClient.get(`/flights/${id}`);
    return response.data.flight;
  },

  createFlight: async (flightData: Partial<Flight>) => {
    const response = await apiClient.post("/flights", flightData);
    return response.data.flight;
  },

  updateFlight: async (id: string, flightData: Partial<Flight>) => {
    const response = await apiClient.put(`/flights/${id}`, flightData);
    return response.data.flight;
  },

  deleteFlight: async (id: string) => {
    await apiClient.delete(`/flights/${id}`);
  },

  getPopularRoutes: async () => {
    const response = await apiClient.get("/flights/popular-routes");
    return response.data.routes;
  },

  // Flight Bookings
  getAllFlightBookings: async (params = {}) => {
    const response = await apiClient.get("/flight-bookings", { params });
    return response.data;
  },

  deleteFlightBooking: async (id: string) => {
    await apiClient.delete(`/flight-bookings/${id}`);
  },

  cancelFlightBooking: async (id: string, reason?: string) => {
    const response = await apiClient.put(`/flight-bookings/${id}`, {
      status: "cancelled",
      cancellationReason: reason,
    });
    return response.data.booking;
  },
};

export interface FlightBooking {
  _id: string;
  bookingNumber: string;
  pnr: string;
  flightId: Flight;
  userId: { _id: string; firstName: string; lastName: string; email: string };
  passengers: any[];
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "paid" | "unpaid" | "failed";
  currency: string;
  totalPrice: number;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}
