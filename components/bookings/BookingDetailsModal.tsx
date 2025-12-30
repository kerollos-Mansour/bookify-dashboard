"use client";
import React from "react";
import { Booking } from "@/services/api";

function formatDate(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours: string | number = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
}

function getStatusBadgeClass(status: string) {
    switch (status.toLowerCase()) {
        case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "confirmed":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "completed":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
}

function getPaymentStatusBadgeClass(status: string) {
    switch (status.toLowerCase()) {
        case "paid":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "unpaid":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "failed":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
}

interface BookingDetailsModalProps {
    isOpen: boolean;
    isLoading: boolean;
    booking: Booking | null;
    onClose: () => void;
    onEdit: () => void;
}

export default function BookingDetailsModal({
    isOpen,
    isLoading,
    booking,
    onClose,
    onEdit,
}: BookingDetailsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-2xl max-h-[90vh]">
                {/* Modal Header */}
                <div className="sticky top-0 flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Booking Details
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
                    {/* Modal Content */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin">
                                <svg
                                    className="h-8 w-8 text-brand-500"
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
                            </div>
                        </div>
                    ) : booking ? (
                        <div className="p-6 space-y-6">
                            {/* Booking Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {booking.bookingNumber}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Booking ID: {booking._id}
                                    </p>
                                </div>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                                        booking.status
                                    )}`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            {/* Guest Information */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                    Guest Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Name
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.userId?.name || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Email
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.userId?.email || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Username
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.userId?.username || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Phone
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.userId?.phoneNo || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Hotel Information */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                    Hotel Information
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Hotel Name
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.hotelId?.name || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Address
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.hotelId?.location
                                                ?.address || "N/A"}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                                City
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {booking.hotelId?.location
                                                    ?.city || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                                Country
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {booking.hotelId?.location
                                                    ?.countryCode || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stay Information */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                    Stay Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Check-In
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(booking.checkIn)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Check-Out
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(booking.checkOut)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Nights
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.nights}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Guests
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.guests}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Information */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                    Pricing Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Price Per Night
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${booking.pricePerNight}{" "}
                                            {booking.currency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Subtotal
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            $
                                            {(
                                                booking.subTotal ??
                                                booking.totalPrice -
                                                    booking.fees
                                            ).toFixed(2)}{" "}
                                            {booking.currency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Fees
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${booking.fees} {booking.currency}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            Total
                                        </span>
                                        <span className="text-lg font-semibold text-brand-500">
                                            ${booking.totalPrice}{" "}
                                            {booking.currency}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                    Payment Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Status
                                        </p>
                                        <span
                                            className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getPaymentStatusBadgeClass(
                                                booking.paymentStatus
                                            )}`}
                                        >
                                            {booking.paymentStatus}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Method
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 capitalize">
                                            {booking.paymentMethod}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Intent ID
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white font-mono break-all">
                                            {booking.paymentIntentId || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                    Additional Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Created At
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(booking.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                            Updated At
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.updatedAt
                                                ? formatDate(booking.updatedAt)
                                                : "N/A"}
                                        </p>
                                    </div>
                                    {booking.couponId && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                                Coupon ID
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                                                {booking.couponId}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={onEdit}
                        className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
                    >
                        Edit Booking
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
