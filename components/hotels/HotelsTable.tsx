"use client";

import React from "react";
import { Hotel } from "@/services/api/hotels.api";
import Link from "next/link";

interface HotelsTableProps {
    hotels: Hotel[];
    isLoading: boolean;
    onEdit: (hotel: Hotel) => void;
    onDelete: (id: string) => void;
    onToggleFeatured: (hotel: Hotel) => void;
}

export default function HotelsTable({
    hotels,
    isLoading,
    onEdit,
    onDelete,
    onToggleFeatured,
}: HotelsTableProps) {
    if (isLoading) {
        return (
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 animate-pulse">
                <div className="h-96 w-full bg-gray-50/50 dark:bg-gray-800/50" />
            </div>
        );
    }

    if (hotels.length === 0) {
        return (
            <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hotels found. Click "Add Hotel" to create one.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Property
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Type
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Rating
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Price Range
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Rooms
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
                        {hotels.map((hotel) => (
                            <tr
                                key={hotel._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                            {hotel.images?.[0] ? (
                                                <img
                                                    src={hotel.images[0]}
                                                    alt={hotel.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {hotel.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {hotel.location?.city ? `${hotel.location.city}, ${hotel.location.countryCode}` : "No location specified"}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                                        {hotel.type || "Hotel"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {hotel.hotelRating?.toFixed(1) || "0.0"}
                                        </span>
                                        <div className="flex items-center text-amber-400">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                                        ${hotel.lowRate || 0} - ${hotel.highRate || 0}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                                        {hotel.totalRooms || "--"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onToggleFeatured(hotel)}
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors ${hotel.featured
                                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-400"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                                            }`}
                                    >
                                        {hotel.featured ? "Best Seller" : "Normal"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/hotels/${hotel._id}/rooms`}
                                            className="p-2 text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                                            title="Manage Rooms"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => onEdit(hotel)}
                                            className="p-2 text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                                            title="Edit Hotel"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(hotel._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                            title="Delete Hotel"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
