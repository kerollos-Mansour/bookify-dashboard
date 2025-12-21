import apiClient from "./client";

// Financial API endpoints

export interface RevenueReport {
  totalRevenue: number;
  completedBookings: number;
  averageBookingValue: number;
  revenueByDate: Array<{
    date: string;
    revenue: number;
  }>;
}

export interface Transaction {
  _id: string;
  booking: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface CouponUsage {
  code: string;
  usageCount: number;
  totalDiscount: number;
}

export const financialsApi = {
  // Get revenue report for a date range
  getRevenueReport: async (startDate?: string, endDate?: string) => {
    const response = await apiClient.get("/financials/revenue", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get transactions list
  getTransactions: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get("/financials/transactions", {
      params,
    });
    return response.data;
  },

  // Get coupon usage statistics
  getCouponUsage: async () => {
    const response = await apiClient.get("/financials/coupons/usage");
    return response.data;
  },
};
