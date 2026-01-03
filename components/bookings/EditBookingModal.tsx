"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Booking } from "@/services/api";

function formatDateForInput(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function calculateNights(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
}

interface BookingFormData {
    status: "pending" | "confirmed" | "cancelled" | "completed";
    paymentStatus: "pending" | "paid" | "unpaid" | "failed";
    paymentMethod: string;
    checkIn: string;
    checkOut: string;
    pricePerNight: number;
    fees: number;
}

interface EditBookingModalProps {
    isOpen: boolean;
    booking: Booking | null;
    onClose: () => void;
    onSave: (updatedBooking: BookingFormData) => void;
}

export default function EditBookingModal({
    isOpen,
    booking,
    onClose,
    onSave,
}: EditBookingModalProps) {
    const [formData, setFormData] = useState<BookingFormData | null>(null);
    const [saving, setSaving] = useState(false);

    const initialFormData = useMemo<BookingFormData | null>(() => {
        if (!booking) return null;
        return {
            status: (booking.status as BookingFormData["status"]) || "pending",
            paymentStatus:
                (booking.paymentStatus as BookingFormData["paymentStatus"]) ||
                "unpaid",
            paymentMethod: (booking.paymentMethod as string) || "stripe",
            checkIn: formatDateForInput(booking.checkIn as string),
            checkOut: formatDateForInput(booking.checkOut as string),
            guests: (booking.guests as number) || 1,
            pricePerNight: (booking.pricePerNight as number) || 0,
            fees: (booking.fees as number) || 0,
        };
    }, [booking]);

    useEffect(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    if (!isOpen || !formData) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev: BookingFormData | null) => {
            if (!prev) return null;
            return {
                ...prev,
                [name]:
                    name === "guests" ||
                    name === "pricePerNight" ||
                    name === "fees"
                        ? parseFloat(value)
                        : value,
            };
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            onSave(formData);
            setSaving(false);
            onClose();
        } catch (error) {
            setSaving(false);
            console.error("Error saving booking:", error);
        }
    };

    const calculateTotal = () => {
        if (!formData) return 0;
        const nights = calculateNights(formData.checkIn, formData.checkOut);
        const subtotal = formData.pricePerNight * nights;
        return subtotal + formData.fees;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-2xl max-h-[90vh]">
                {/* Modal Header */}
                <div className="sticky top-0 flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Edit Booking
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[65vh]">
                    <div className="p-6 space-y-6">
                        {/* Booking Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {booking?.bookingNumber}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Booking ID: {booking?._id}
                            </p>
                        </div>

                        {/* Status Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                Booking Status
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">
                                            Confirmed
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Payment Status
                                    </label>
                                    <select
                                        name="paymentStatus"
                                        value={formData.paymentStatus}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">Unpaid</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                Payment Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
                                    >
                                        <option value="stripe">Stripe</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="credit_card">
                                            Credit Card
                                        </option>
                                        <option value="bank_transfer">
                                            Bank Transfer
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dates Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                Stay Dates
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Check-In
                                    </label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        value={formData.checkIn}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Check-Out
                                    </label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        value={formData.checkOut}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                Pricing
                            </h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Price Per Night
                                        </label>
                                        <input
                                            type="number"
                                            name="pricePerNight"
                                            value={formData.pricePerNight}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Fees
                                        </label>
                                        <input
                                            type="number"
                                            name="fees"
                                            value={formData.fees}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Total
                                        </span>
                                        <span className="text-lg font-semibold text-brand-500">
                                            ${calculateTotal().toFixed(2)}{" "}
                                            {(booking?.currency as string) ||
                                                "USD"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        {saving && (
                            <svg
                                className="animate-spin h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        )}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
