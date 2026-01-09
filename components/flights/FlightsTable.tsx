"use client";

import React from "react";
import { Flight } from "@/services/api/flights.api";

interface FlightsTableProps {
  flights: Flight[];
  isLoading: boolean;
  onEdit: (flight: Flight) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (flight: Flight) => void;
}

export default function FlightsTable({
  flights,
  isLoading,
  onEdit,
  onDelete,
  onToggleFeatured,
}: FlightsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 animate-pulse">
        <div className="h-96 w-full bg-gray-50/50 dark:bg-gray-800/50" />
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No flights found. Click "Add Flight" to create one.
        </p>
      </div>
    );
  }

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getLowestPrice = (flight: Flight) => {
    const prices = [];
    if (flight.pricing.economy.available)
      prices.push(flight.pricing.economy.price);
    if (flight.pricing.business.available)
      prices.push(flight.pricing.business.price);
    if (flight.pricing.firstClass.available)
      prices.push(flight.pricing.firstClass.price);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "delayed":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "completed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Flight
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Route
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Departure
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Duration
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Price From
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Featured
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-right text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {flights.map((flight) => (
              <tr
                key={flight._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {flight.airline}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {flight.flightNumber}
                    </p>
                    {flight.aircraft && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {flight.aircraft}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {flight.departure.airport.code} →{" "}
                      {flight.arrival.airport.code}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {flight.departure.airport.city} →{" "}
                      {flight.arrival.airport.city}
                    </div>
                    {flight.stops > 0 && (
                      <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        {flight.stops} stop{flight.stops > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatTime(flight.departure.dateTime)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {formatDuration(flight.duration)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">
                    ${getLowestPrice(flight)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      flight.status
                    )}`}
                  >
                    {flight.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleFeatured(flight)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      flight.featured
                        ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {flight.featured ? "Featured" : "Normal"}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(flight)}
                      className="p-2 text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                      title="Edit Flight"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(flight._id)}
                      className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      title="Delete Flight"
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
