import apiClient from "./client";

// Dashboard/Stats API endpoints

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  activeBookings: number;
  bookingsChange: number;
  totalUsers: number;
  usersChange: number;
  totalHotels: number;
  hotelsChange: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface BookingStatusData {
  status: string;
  count: number;
}

export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Fetch data from multiple endpoints
      const [bookingsResponse, usersResponse, hotelsResponse] =
        await Promise.all([
          apiClient.get("/bookings"),
          apiClient.get("/users"),
          apiClient.get("/hotels"),
        ]);

      // Extract arrays from responses
      const bookingsData = Array.isArray(bookingsResponse.data)
        ? bookingsResponse.data
        : [];
      const usersData = Array.isArray(usersResponse.data)
        ? usersResponse.data
        : [];
      const hotelsData = Array.isArray(hotelsResponse.data)
        ? hotelsResponse.data
        : [];

      // Calculate active bookings
      const activeBookings = bookingsData.filter(
        (b: { status: string }) =>
          b.status === "confirmed" || b.status === "pending"
      ).length;

      // Calculate total revenue from paid bookings
      const totalRevenue = bookingsData
        .filter((b: { paymentStatus: string }) => b.paymentStatus === "paid")
        .reduce(
          (sum: number, b: { totalPrice: number }) => sum + (b.totalPrice || 0),
          0
        );

      return {
        totalRevenue,
        revenueChange: 12.5, // TODO: Calculate actual percentage change from previous period
        activeBookings,
        bookingsChange: 8.2, // TODO: Calculate actual percentage change
        totalUsers: usersData.length,
        usersChange: 23.1, // TODO: Calculate actual percentage change
        totalHotels: hotelsData.length,
        hotelsChange: 4.3, // TODO: Calculate actual percentage change
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // Get revenue over time data
  getRevenueData: async (days: number = 7): Promise<RevenueData[]> => {
    try {
      const bookingsResponse = await apiClient.get("/bookings");
      const bookingsData = Array.isArray(bookingsResponse.data)
        ? bookingsResponse.data
        : [];

      // Group bookings by date
      const revenueByDate: Record<string, number> = {};

      bookingsData
        .filter((b: { paymentStatus: string }) => b.paymentStatus === "paid")
        .forEach((booking: { createdAt: string; totalPrice: number }) => {
          const date = new Date(booking.createdAt).toISOString().split("T")[0];
          revenueByDate[date] = (revenueByDate[date] || 0) + booking.totalPrice;
        });

      // Convert to array and sort
      const result = Object.entries(revenueByDate)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-days);

      return result;
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      return [];
    }
  },

  // Get bookings by status
  getBookingsByStatus: async (): Promise<BookingStatusData[]> => {
    try {
      const bookingsResponse = await apiClient.get("/bookings");
      const bookingsData = Array.isArray(bookingsResponse.data)
        ? bookingsResponse.data
        : [];

      const statusCounts: Record<string, number> = {};

      bookingsData.forEach((booking: { status: string }) => {
        const status = booking.status || "unknown";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      return Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
      }));
    } catch (error) {
      console.error("Error fetching bookings by status:", error);
      return [];
    }
  },
};
