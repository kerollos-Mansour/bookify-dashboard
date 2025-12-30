"use client";

import React, { useState, useEffect, useCallback } from "react";
import { hotelsApi, Hotel, Room } from "@/services/api/hotels.api";
import RoomsTable from "@/components/rooms/RoomsTable";
import RoomForm from "@/components/rooms/RoomForm";
import toast from "react-hot-toast";

export default function RoomsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [isLoading, setIsLoading] = useState(false);
  const [isHotelsLoading, setIsHotelsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await hotelsApi.getAllHotels({ limit: 100 });
        setHotels(response.hotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        toast.error("Failed to load hotels list");
      } finally {
        setIsHotelsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Fetch rooms when hotel changes
  const fetchRooms = useCallback(async () => {
    if (!selectedHotelId) {
      setRooms([]);
      return;
    }

    setIsLoading(true);
    try {
      const roomsData = await hotelsApi.getHotelRooms(selectedHotelId);
      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms for this hotel");
    } finally {
      setIsLoading(false);
    }
  }, [selectedHotelId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    if (!selectedHotelId) {
      toast.error("Please select a hotel first");
      return;
    }
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
                fetchRooms();
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
        await hotelsApi.createRoom({ ...data, hotelId: selectedHotelId });
        toast.success("Room created successfully");
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (error: any) {
      console.error("Error saving room:", error);
      toast.error(error.response?.data?.message || "Failed to save room");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (statusFilter === "All Status") return true;
    return room.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Room Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage room types, pricing, and availability
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
        >
          Add Room
        </button>
      </div>

      {/* Hotel Selector and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <select
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            disabled={isHotelsLoading}
            className="h-11 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 px-4 text-sm text-gray-800 focus:border-brand-500 focus:outline-hidden focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90 transition-all cursor-pointer min-w-[200px]"
          >
            <option value="">Select Hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 px-4 text-sm text-gray-800 focus:border-brand-500 focus:outline-hidden focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90 transition-all cursor-pointer"
          >
            <option>All Status</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
      </div>

      {!selectedHotelId ? (
        <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a hotel to view and manage its room inventory.
          </p>
        </div>
      ) : (
        <RoomsTable
          rooms={filteredRooms}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

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
