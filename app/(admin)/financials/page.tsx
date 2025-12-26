"use client";
import React, { useState, useEffect } from "react";
import { bookingsApi, Booking } from "@/services/api";

interface Transaction {
  id: string;
  date: string;
  bookingId: string;
  amount: string;
  status: string;
  user: string;
}

export default function FinancialsPage() {
  const [selectedRange, setSelectedRange] = useState("week");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedBookings: 0,
    averageBookingValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const bookingsData = await bookingsApi.getAllBookings();
        const bookings = Array.isArray(bookingsData) ? bookingsData : [];

        // Calculate stats
        const paidBookings = bookings.filter(
          (b: Booking) => b.paymentStatus === "paid"
        );
        const totalRevenue = paidBookings.reduce(
          (sum: number, b: Booking) => sum + b.totalPrice,
          0
        );
        const completedBookings = bookings.filter(
          (b: Booking) => b.status === "completed"
        ).length;
        const averageBookingValue =
          paidBookings.length > 0 ? totalRevenue / paidBookings.length : 0;

        setStats({
          totalRevenue,
          completedBookings,
          averageBookingValue,
        });

        // Convert bookings to transactions
        const transactionsList: Transaction[] = paidBookings
          .slice(0, 5)
          .map((booking: Booking) => ({
            id: booking._id,
            date: new Date(booking.createdAt).toLocaleDateString(),
            bookingId: booking._id.slice(-6).toUpperCase(),
            amount: `$${booking.totalPrice.toFixed(2)}`,
            status: booking.paymentStatus,
            user:
              booking.userId?.username || booking.userId?.email || "Unknown",
          }));

        setTransactions(transactionsList);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Financials
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Revenue reports and financial analytics
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedRange("week")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedRange === "week"
                ? "text-white bg-brand-500 hover:bg-brand-600"
                : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedRange("month")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedRange === "month"
                ? "text-white bg-brand-500 hover:bg-brand-600"
                : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            Last Month
          </button>
          <button
            onClick={() => setSelectedRange("custom")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedRange === "custom"
                ? "text-white bg-brand-500 hover:bg-brand-600"
                : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            Custom Range
          </button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative p-6 overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Revenue
              </p>
              {loading ? (
                <div className="mt-2 h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              ) : (
                <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2">
                <svg
                  className="w-4 h-4 text-success-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-xs font-medium text-success-600 dark:text-success-400">
                  +12.5%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  vs last period
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 transition-all duration-300 transform scale-x-0 bg-gradient-to-r from-success-500 to-success-600 group-hover:scale-x-100"></div>
        </div>

        <div className="relative p-6 overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed Bookings
              </p>
              {loading ? (
                <div className="mt-2 h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              ) : (
                <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
                  {stats.completedBookings}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2">
                <svg
                  className="w-4 h-4 text-success-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-xs font-medium text-success-600 dark:text-success-400">
                  +8.2%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 transition-all duration-300 transform scale-x-0 bg-gradient-to-r from-brand-500 to-brand-600 group-hover:scale-x-100"></div>
        </div>

        <div className="relative p-6 overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Booking Value
              </p>
              {loading ? (
                <div className="mt-2 h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              ) : (
                <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
                  ${stats.averageBookingValue.toFixed(0)}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2">
                <svg
                  className="w-4 h-4 text-success-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-xs font-medium text-success-600 dark:text-success-400">
                  +5.3%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-warning-50 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 transition-all duration-300 transform scale-x-0 bg-gradient-to-r from-warning-500 to-warning-600 group-hover:scale-x-100"></div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
            Recent Transactions
          </h3>
          <button className="px-3 py-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Booking
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No transactions found. Transactions will appear here when
                      bookings are paid.
                    </p>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.user}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.bookingId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-400">
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Usage - Coming Soon */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
          Coupon Usage Statistics
        </h3>
        <div className="p-12 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Coupon statistics will be available once the coupon system is
            integrated with the API.
          </p>
        </div>
      </div>
    </div>
  );
}
