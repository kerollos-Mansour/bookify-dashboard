"use client";

import React from "react";
import { FlightBooking } from "@/services/api/flights.api";

interface FlightBookingsTableProps {
  bookings: FlightBooking[];
  isLoading: boolean;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FlightBookingsTable({
  bookings,
  isLoading,
  onCancel,
  onDelete,
}: FlightBookingsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 animate-pulse">
        <div className="h-96 w-full bg-gray-50/50 dark:bg-gray-800/50" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No flight bookings found.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 dark:text-green-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-amber-600 dark:text-amber-400";
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Booking ID
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Passenger
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Flight Info
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Payment
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-right text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                id={`booking-${booking._id}`}
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.bookingNumber}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    PNR: {booking.pnr}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.userId?.firstName} {booking.userId?.lastName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {booking.contactEmail}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {booking.passengers?.length} Passenger(s)
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.flightId?.airline || "Unknown Airline"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {booking.flightId?.flightNumber}
                  </div>
                  {booking.flightId?.departure && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {booking.flightId.departure.airport?.code} →{" "}
                      {booking.flightId.arrival?.airport?.code}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${booking.totalPrice}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center text-xs font-medium capitalize ${getPaymentColor(
                      booking.paymentStatus
                    )}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {booking.status !== "cancelled" &&
                      booking.status !== "completed" && (
                        <button
                          onClick={() => onCancel(booking._id)}
                          className="text-xs font-medium text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    <button
                      onClick={() => onDelete(booking._id)}
                      className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      title="Delete Record"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
