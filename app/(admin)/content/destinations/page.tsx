"use client";

import React, { useState, useEffect } from "react";
import { Destination, contentApi } from "@/services/api/content.api";
import DestinationForm from "@/components/destinations/DestinationForm";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | undefined>(undefined);

  const fetchDestinations = async () => {
    try {
      setIsLoading(true);
      const data = await contentApi.getAllDestinations();
      if (Array.isArray(data)) {
        setDestinations(data);
      } else {
        if (data?.data && Array.isArray(data.data)) {
          setDestinations(data.data);
        } else {
          console.error("Unexpected data format", data);
          setDestinations([]);
        }
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch destinations");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleCreate = async (data: Partial<Destination>) => {
    try {
      await contentApi.createDestination(data);
      await fetchDestinations();
      setIsFormOpen(false);
    } catch (err) {
      alert("Failed to create destination");
      console.error(err);
    }
  };

  const handleUpdate = async (data: Partial<Destination>) => {
    if (!editingDestination) return;
    try {
      await contentApi.updateDestination(editingDestination._id, data);
      await fetchDestinations();
      setIsFormOpen(false);
      setEditingDestination(undefined);
    } catch (err) {
      alert("Failed to update destination");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this destination?")) {
      try {
        await contentApi.deleteDestination(id);
        await fetchDestinations();
      } catch (err) {
        alert("Failed to delete destination");
        console.error(err);
      }
    }
  };

  const handleToggleBestSeller = async (destination: Destination) => {
    try {
      await contentApi.updateDestination(destination._id, {
        bestSeller: !destination.bestSeller,
      });
      setDestinations(destinations.map(d =>
        d._id === destination._id ? { ...d, bestSeller: !d.bestSeller } : d
      ));
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  const openEditModal = (destination: Destination) => {
    setEditingDestination(destination);
    setIsFormOpen(true);
  };

  const openCreateModal = () => {
    setEditingDestination(undefined);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
        {error}
        <button
          onClick={() => fetchDestinations()}
          className="block mx-auto mt-2 text-sm font-medium underline hover:no-underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Destinations
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage destinations, locations, and pricing
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors"
        >
          Add Destination
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
          <div key={destination._id} className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 flex flex-col group">
            <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
              <img
                src={destination.image || "https://placehold.co/600x400?text=No+Image"}
                alt={destination.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleToggleBestSeller(destination)}
                  title={destination.bestSeller ? "Remove from Best Seller" : "Mark as Best Seller"}
                  className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${destination.bestSeller
                    ? "bg-yellow-400/90 text-yellow-900"
                    : "bg-black/30 text-white hover:bg-black/50"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-1 text-xs font-semibold text-white bg-black/50 rounded-md backdrop-blur-sm">
                  {destination.price}
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                    {destination.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 10 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.003.001a.75.75 0 00.014-.044zM10 7a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
                      </svg>
                      {destination.location}
                    </span>
                  </p>
                </div>
                {destination.rating > 0 && (
                  <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    ★ {destination.rating}
                  </span>
                )}
              </div>



              <div className="mt-auto pt-4 flex gap-2">
                <button
                  onClick={() => openEditModal(destination)}
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(destination._id)}
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 dark:bg-error-500/10 dark:text-error-400 dark:hover:bg-error-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={openCreateModal}
          className="flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50 transition-all group"
        >
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-400 dark:text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">Add New Destination</p>
        </button>
      </div>

      {!isLoading && destinations.length === 0 && (
        <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No destinations to display. Add destinations via the API or button.
          </p>
        </div>
      )}

      <DestinationForm
        isOpen={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={editingDestination ? handleUpdate : handleCreate}
        initialData={editingDestination || undefined}
      />
    </div>
  );
}
