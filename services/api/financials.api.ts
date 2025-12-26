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
  userId: {
    _id: string;
    email: string;
    name: string;
  };
  hotelId: {
    _id: string;
    name: string;
  };
  roomId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  subTotal: number;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  status: string;
  couponId: string | null;
  paymentStatus: string;
  paymentMethod: string;
  paymentIntentId: string;
  createdAt: string;
  bookingNumber: string;
  fees: number;
  updatedAt: string;
  __v: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
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
