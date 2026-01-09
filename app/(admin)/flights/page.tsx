"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Flight,
  flightsApi,
  GetFlightsParams,
} from "@/services/api/flights.api";
import FlightsTable from "@/components/flights/FlightsTable";
import FlightForm from "@/components/flights/FlightForm";
import toast from "react-hot-toast";

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalFlights: 0,
  });

  const fetchFlights = useCallback(
    async (params: GetFlightsParams = {}) => {
      setIsLoading(true);
      try {
        const queryParams: GetFlightsParams = {
          page: pagination.page,
          limit: 10,
          ...params,
        };

        if (search) {
          queryParams.airline = search;
        }
        if (statusFilter && statusFilter !== "all") {
          queryParams.status = statusFilter;
        }

        const response = await flightsApi.getAllFlights(queryParams);

        setFlights(response.flights);
        setPagination({
          page: response.pagination.page,
          totalPages: response.pagination.totalPages,
          totalFlights: response.pagination.total,
        });
      } catch (error) {
        console.error("Error fetching flights:", error);
        toast.error("Failed to load flights");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [pagination.page, search, statusFilter]
  );

  useEffect(() => {
    const timer = setTimeout(
      () => {
        fetchFlights();
      },
      pagination.page !== 1 ? 0 : 500
    );

    return () => clearTimeout(timer);
  }, [fetchFlights]);

  const handleToggleFeatured = async (flight: Flight) => {
    try {
      await flightsApi.updateFlight(flight._id, { featured: !flight.featured });
      toast.success(
        `${flight.airline} ${flight.flightNumber} updated successfully`
      );
      fetchFlights();
    } catch (error) {
      console.error("Error updating flight:", error);
      toast.error("Failed to update flight status");
    }
  };

  const handleDelete = async (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Delete this flight?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await flightsApi.deleteFlight(id);
                  toast.success("Flight deleted successfully");
                  fetchFlights();
                } catch (error) {
                  console.error("Error deleting flight:", error);
                  toast.error("Failed to delete flight");
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

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingFlight(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Flight>) => {
    setIsSubmitting(true);
    try {
      if (editingFlight) {
        await flightsApi.updateFlight(editingFlight._id, data);
        toast.success(`Flight ${data.flightNumber} updated successfully`);
      } else {
        await flightsApi.createFlight(data);
        toast.success(`Flight ${data.flightNumber} created successfully`);
      }
      setIsModalOpen(false);
      fetchFlights();
    } catch (error: any) {
      console.error("Error saving flight:", error);
      toast.error(error.response?.data?.message || "Failed to save flight");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Flights Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage {pagination.totalFlights} flights and their details
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
        >
          Add Flight
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by airline or flight number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90 dark:placeholder:text-white/30 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 px-4 text-sm text-gray-800 focus:border-brand-500 focus:outline-hidden focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90 transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="delayed">Delayed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 group"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="text-sm font-medium whitespace-nowrap">
              Reset Filters
            </span>
          </button>
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchFlights();
            }}
            disabled={isLoading}
            className="h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
          </button>
        </div>
      </div>

      <FlightsTable
        flights={flights}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
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

      <FlightForm
        isOpen={isModalOpen}
        flight={editingFlight}
        isLoading={isSubmitting}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
