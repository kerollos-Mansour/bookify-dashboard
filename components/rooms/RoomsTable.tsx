"use client";

import React from "react";
import { Room } from "@/services/api/hotels.api";

interface RoomsTableProps {
    rooms: Room[];
    isLoading: boolean;
    onEdit: (room: Room) => void;
    onDelete: (id: string) => void;
}

export default function RoomsTable({
    rooms,
    isLoading,
    onEdit,
    onDelete,
}: RoomsTableProps) {
    if (isLoading) {
        return (
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 animate-pulse">
                <div className="h-64 w-full bg-gray-50/50 dark:bg-gray-800/50" />
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No rooms found for this hotel.
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
                                Room Name
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Bed Type
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Price
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Quantity
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Status
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-left text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Sleeps
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-right text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {rooms.map((room) => (
                            <tr
                                key={room._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {room.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium capitalize">
                                            {room.bedType}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {room.bedrooms} Bedroom(s)
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        {room.price.discounted && room.price.discounted > 0 ? (
                                            <>
                                                <span className="text-sm text-gray-900 dark:text-white font-semibold">
                                                    ${room.price.discounted}
                                                </span>
                                                <span className="text-[10px] text-gray-400 line-through">
                                                    ${room.price.original}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-900 dark:text-white font-semibold">
                                                ${room.price.original}
                                            </span>
                                        )}
                                        <span className="text-[10px] text-gray-400 uppercase">
                                            {room.price.currency}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {room.quantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${room.status === "available"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : room.status === "occupied"
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                        {room.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {room.sleeps} persons
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(room)}
                                            className="p-2 text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(room._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
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
