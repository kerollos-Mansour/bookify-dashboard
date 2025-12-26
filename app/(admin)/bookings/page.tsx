"use client";
import React from "react";
import { useEffect, useState } from "react";
import { bookingsApi, Booking } from "@/services/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Booking["status"] | "">("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const data = await bookingsApi.getAllBookings({
        status: status || undefined,
        search: search || undefined,
        startDate: startDate || undefined,
      });

      // adjust this line if backend response shape is different
      setBookings(data.bookings || data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBookings();
}, [status, search, startDate]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Booking Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage customer bookings
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setStatus("")}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${status === ""
              ? "text-brand-500 border-b-2 border-brand-500"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
        >
          All
        </button>

        <button
          onClick={() => setStatus("pending")}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${status === "pending"
              ? "text-brand-500 border-b-2 border-brand-500"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
        >
          Pending
        </button>

        <button
          onClick={() => setStatus("confirmed")}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${status === "confirmed"
              ? "text-brand-500 border-b-2 border-brand-500"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
        >
          Confirmed
        </button>

        <button
          onClick={() => setStatus("cancelled")}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${status === "cancelled"
              ? "text-brand-500 border-b-2 border-brand-500"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
        >
          Canceld
        </button>

        <button
          onClick={() => setStatus("completed")}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${status === "completed"
              ? "text-brand-500 border-b-2 border-brand-500"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
        >
          Completed
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}

            placeholder="Search by booking ID, user, or hotel..."
            className="w-full h-11 rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90 dark:placeholder:text-white/30"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90"
          />
        </div>
      </div>

      {/* Table Placeholder */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Hotel
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Dates
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Total
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Payment
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* 1️⃣ Loading */}
              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">Loading bookings...</p>
                  </td>
                </tr>
              )}

              {/* 2️⃣ No Data */}
              {!loading && bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">No bookings found</p>
                  </td>
                </tr>
              )}

              {/* 3️⃣ Show Data */}
              {!loading &&
                bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-t border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-6 py-4 text-sm">{booking._id}</td>
                    <td className="px-6 py-4 text-sm">{booking.user}</td>
                    <td className="px-6 py-4 text-sm">{booking.hotel}</td>
                    <td className="px-6 py-4 text-sm">
                      {booking.checkIn} → {booking.checkOut}
                    </td>
                    <td className="px-6 py-4 text-sm">${booking.totalPrice}</td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {booking.status}
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {booking.paymentStatus}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {/* actions later */}
                      —
                    </td>
                  </tr>
                ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
