// Export all API services for easy importing

export { default as apiClient } from "./client";
export { usersApi } from "./users.api";
export { hotelsApi } from "./hotels.api";
export { bookingsApi } from "./bookings.api";
export { financialsApi } from "./financials.api";
export { contentApi } from "./content.api";

// Export types
export type { User, GetUsersParams } from "./users.api";
export type { Hotel, GetHotelsParams } from "./hotels.api";
export type { Booking, GetBookingsParams } from "./bookings.api";
export type { RevenueReport, Transaction, CouponUsage } from "./financials.api";
export type { Destination, Category, Review } from "./content.api";
