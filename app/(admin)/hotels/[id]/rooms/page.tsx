"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import { hotelsApi, Hotel, Room } from "@/services/api/hotels.api";
import RoomsTable from "@/components/rooms/RoomsTable";
import RoomForm from "@/components/rooms/RoomForm";
import Link from "next/link";
import toast from "react-hot-toast";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function HotelRoomsPage({ params }: PageProps) {
    const { id } = use(params);
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [hotelData, roomsData] = await Promise.all([
                hotelsApi.getHotelById(id),
                hotelsApi.getHotelRooms(id),
            ]);
            setHotel(hotelData);
            setRooms(roomsData);
        } catch (error) {
            console.error("Error fetching hotel rooms:", error);
            toast.error("Failed to load hotel rooms");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = (room: Room) => {
        setEditingRoom(room);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingRoom(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (roomId: string) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p className="font-medium">Delete this room?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await hotelsApi.deleteRoom(roomId);
                                toast.success("Room deleted successfully");
                                fetchData();
                            } catch (error) {
                                console.error("Error deleting room:", error);
                                toast.error("Failed to delete room");
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
        ), { duration: 5000 });
    };

    const handleFormSubmit = async (data: Partial<Room>) => {
        setIsSubmitting(true);
        try {
            if (editingRoom) {
                await hotelsApi.updateRoom(editingRoom._id, data);
                toast.success("Room updated successfully");
            } else {
                await hotelsApi.createRoom({ ...data, hotelId: id });
                toast.success("Room created successfully");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            console.error("Error saving room:", error);
            toast.error(error.response?.data?.message || "Failed to save room");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/hotels"
                        className="p-2 -ml-2 text-gray-500 hover:text-brand-500 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {hotel ? `${hotel.name} - Rooms` : "Manage Rooms"}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {hotel ? `Location: ${hotel.location.city}, ${hotel.location.countryCode}` : "Manage room inventory for this property"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
                >
                    Add Room
                </button>
            </div>

            {/* Stats Overview */}
            {hotel && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Rooms</p>
                        <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{rooms.length}</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property Type</p>
                        <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white capitalize">{hotel.type}</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Price</p>
                        <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">${hotel.lowRate}</p>
                    </div>
                </div>
            )}

            {/* Rooms Table */}
            <RoomsTable
                rooms={rooms}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Room Form Modal */}
            <RoomForm
                isOpen={isModalOpen}
                room={editingRoom}
                isLoading={isSubmitting}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}
