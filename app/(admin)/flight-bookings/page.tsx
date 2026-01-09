"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FlightBooking, flightsApi } from "@/services/api/flights.api";
import FlightBookingsTable from "@/components/flightBookings/FlightBookingsTable";
import toast from "react-hot-toast";

export default function FlightBookingsPage() {
  const [bookings, setBookings] = useState<FlightBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalBookings: 0,
  });

  const fetchBookings = useCallback(
    async (params: any = {}) => {
      setIsLoading(true);
      try {
        const queryParams: any = {
          page: pagination.page,
          limit: 10,
          ...params,
        };

        if (statusFilter && statusFilter !== "all") {
          queryParams.status = statusFilter;
        }

        const response = await flightsApi.getAllFlightBookings(queryParams);

        setBookings(response.bookings);
        setPagination({
          page: response.page,
          totalPages: response.totalPages,
          totalBookings: response.totalBookings,
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load flight bookings");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [pagination.page, statusFilter]
  );

  useEffect(() => {
    const timer = setTimeout(
      () => {
        fetchBookings();
      },
      pagination.page !== 1 ? 0 : 500
    );

    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleCancel = async (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Cancel this booking?</p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await flightsApi.cancelFlightBooking(
                    id,
                    "Cancelled by admin"
                  );
                  toast.success("Booking cancelled successfully");
                  fetchBookings();
                } catch (error) {
                  console.error("Error cancelling booking:", error);
                  toast.error("Failed to cancel booking");
                }
              }}
              className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
            >
              Confirm Cancel
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
            >
              Go Back
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleDelete = async (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Delete this record?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await flightsApi.deleteFlightBooking(id);
                  toast.success("Record deleted successfully");
                  fetchBookings();
                } catch (error) {
                  console.error("Error deleting booking:", error);
                  toast.error("Failed to delete booking");
                }
              }}
              className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Flight Bookings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage {pagination.totalBookings} flight reservations
          </p>
        </div>
        <button
          onClick={() => {
            setIsRefreshing(true);
            fetchBookings();
          }}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-70"
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          {/* Search Placeholder - Search API not implemented yet fully on backend for Bookings */}
          <div className="text-sm text-gray-500 italic">
            Search functionality coming soon...
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 px-4 text-sm text-gray-800 focus:border-brand-500 focus:outline-hidden focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90 transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <FlightBookingsTable
        bookings={bookings}
        isLoading={isLoading}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
