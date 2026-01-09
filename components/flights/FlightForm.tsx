"use client";

import React, { useState, useEffect } from "react";
import { Flight } from "@/services/api/flights.api";

interface FlightFormProps {
  isOpen: boolean;
  flight: Flight | null;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (data: Partial<Flight>) => void;
}

export default function FlightForm({
  isOpen,
  flight,
  isLoading,
  onCancel,
  onSubmit,
}: FlightFormProps) {
  const [formData, setFormData] = useState<Partial<Flight>>({
    airline: "",
    flightNumber: "",
    aircraft: "",
    departure: {
      airport: { code: "", name: "", city: "", country: "" },
      dateTime: "",
      terminal: "",
    },
    arrival: {
      airport: { code: "", name: "", city: "", country: "" },
      dateTime: "",
      terminal: "",
    },
    duration: 0,
    stops: 0,
    pricing: {
      economy: { available: true, price: 0, availableSeats: 0 },
      business: { available: false, price: 0, availableSeats: 0 },
      firstClass: { available: false, price: 0, availableSeats: 0 },
    },
    status: "scheduled",
    amenities: [],
    featured: false,
  });

  useEffect(() => {
    if (flight) {
      setFormData(flight);
    } else {
      // Reset form
      setFormData({
        airline: "",
        flightNumber: "",
        aircraft: "",
        departure: {
          airport: { code: "", name: "", city: "", country: "" },
          dateTime: "",
          terminal: "",
        },
        arrival: {
          airport: { code: "", name: "", city: "", country: "" },
          dateTime: "",
          terminal: "",
        },
        duration: 0,
        stops: 0,
        pricing: {
          economy: { available: true, price: 0, availableSeats: 0 },
          business: { available: false, price: 0, availableSeats: 0 },
          firstClass: { available: false, price: 0, availableSeats: 0 },
        },
        status: "scheduled",
        amenities: [],
        featured: false,
      });
    }
  }, [flight, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50" onClick={onCancel} />

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {flight ? "Edit Flight" : "Add New Flight"}
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Airline *
                    </label>
                    <input
                      type="text"
                      value={formData.airline}
                      onChange={(e) => updateField("airline", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Flight Number *
                    </label>
                    <input
                      type="text"
                      value={formData.flightNumber}
                      onChange={(e) =>
                        updateField("flightNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Aircraft
                    </label>
                    <input
                      type="text"
                      value={formData.aircraft || ""}
                      onChange={(e) => updateField("aircraft", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Departure */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Departure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Airport Code *
                    </label>
                    <input
                      type="text"
                      value={formData.departure?.airport.code}
                      onChange={(e) =>
                        updateField("departure.airport.code", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Airport Name *
                    </label>
                    <input
                      type="text"
                      value={formData.departure?.airport.name}
                      onChange={(e) =>
                        updateField("departure.airport.name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.departure?.airport.city}
                      onChange={(e) =>
                        updateField("departure.airport.city", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.departure?.airport.country}
                      onChange={(e) =>
                        updateField("departure.airport.country", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Departure Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={
                        formData.departure?.dateTime
                          ? new Date(formData.departure.dateTime)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        updateField("departure.dateTime", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Terminal
                    </label>
                    <input
                      type="text"
                      value={formData.departure?.terminal || ""}
                      onChange={(e) =>
                        updateField("departure.terminal", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Arrival
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Airport Code *
                    </label>
                    <input
                      type="text"
                      value={formData.arrival?.airport.code}
                      onChange={(e) =>
                        updateField("arrival.airport.code", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Airport Name *
                    </label>
                    <input
                      type="text"
                      value={formData.arrival?.airport.name}
                      onChange={(e) =>
                        updateField("arrival.airport.name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.arrival?.airport.city}
                      onChange={(e) =>
                        updateField("arrival.airport.city", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.arrival?.airport.country}
                      onChange={(e) =>
                        updateField("arrival.airport.country", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Arrival Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={
                        formData.arrival?.dateTime
                          ? new Date(formData.arrival.dateTime)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        updateField("arrival.dateTime", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Terminal
                    </label>
                    <input
                      type="text"
                      value={formData.arrival?.terminal || ""}
                      onChange={(e) =>
                        updateField("arrival.terminal", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Flight Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        updateField("duration", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stops
                    </label>
                    <input
                      type="number"
                      value={formData.stops}
                      onChange={(e) =>
                        updateField("stops", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => updateField("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="delayed">Delayed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Pricing & Availability
                </h3>

                {/* Economy */}
                <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={formData.pricing?.economy.available}
                      onChange={(e) =>
                        updateField(
                          "pricing.economy.available",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-brand-500"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      Economy Class
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        value={formData.pricing?.economy.price}
                        onChange={(e) =>
                          updateField(
                            "pricing.economy.price",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        disabled={!formData.pricing?.economy.available}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Available Seats
                      </label>
                      <input
                        type="number"
                        value={formData.pricing?.economy.availableSeats}
                        onChange={(e) =>
                          updateField(
                            "pricing.economy.availableSeats",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        disabled={!formData.pricing?.economy.available}
                      />
                    </div>
                  </div>
                </div>

                {/* Business */}
                <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={formData.pricing?.business.available}
                      onChange={(e) =>
                        updateField(
                          "pricing.business.available",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-brand-500"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      Business Class
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        value={formData.pricing?.business.price}
                        onChange={(e) =>
                          updateField(
                            "pricing.business.price",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        disabled={!formData.pricing?.business.available}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Available Seats
                      </label>
                      <input
                        type="number"
                        value={formData.pricing?.business.availableSeats}
                        onChange={(e) =>
                          updateField(
                            "pricing.business.availableSeats",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        disabled={!formData.pricing?.business.available}
                      />
                    </div>
                  </div>
                </div>

                {/* First Class */}
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={formData.pricing?.firstClass.available}
                      onChange={(e) =>
                        updateField(
                          "pricing.firstClass.available",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-brand-500"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      First Class
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        value={formData.pricing?.firstClass.price}
                        onChange={(e) =>
                          updateField(
                            "pricing.firstClass.price",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        disabled={!formData.pricing?.firstClass.available}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Available Seats
                      </label>
                      <input
                        type="number"
                        value={formData.pricing?.firstClass.availableSeats}
                        onChange={(e) =>
                          updateField(
                            "pricing.firstClass.availableSeats",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        disabled={!formData.pricing?.firstClass.available}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  className="w-4 h-4 text-brand-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                  Featured Flight
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading
                  ? "Saving..."
                  : flight
                  ? "Update Flight"
                  : "Create Flight"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
