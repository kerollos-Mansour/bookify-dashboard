"use client";

import React, { useState, useEffect, useRef } from "react";
import { Hotel } from "@/services/api/hotels.api";
import { contentApi } from "@/services/api/content.api";
import { toast } from "react-hot-toast";

interface HotelFormProps {
  hotel?: Hotel | null;
  isOpen: boolean;
  onSubmit: (data: Partial<Hotel>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function HotelForm({
  hotel,
  isOpen,
  onSubmit,
  onCancel,
  isLoading,
}: HotelFormProps) {
  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: "",
    type: "hotel",
    propertyCategory: "Luxury",
    hotelRating: 5,
    confidenceRating: 5,
    lowRate: 0,
    highRate: 0,
    featured: false,
    hotelDetails: "",
    tripAdvisorRating: 0,
    images: [],
    location: {
      address: "",
      city: "",
      stateProvinceCode: "",
      countryCode: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hotel) {
      setFormData(hotel);
      setPreviewUrls(hotel.images || []);
    } else if (isOpen) {
      // Reset form for new hotel when modal opens
      setFormData({
        name: "",
        type: "hotel",
        propertyCategory: "Luxury",
        hotelRating: 5,
        confidenceRating: 5,
        lowRate: 0,
        highRate: 0,
        featured: false,
        hotelDetails: "",
        tripAdvisorRating: 0,
        images: [],
        location: {
          address: "",
          city: "",
          stateProvinceCode: "",
          countryCode: "",
          latitude: 0,
          longitude: 0,
        },
      });
      setPreviewUrls([]);
      setSelectedFiles([]);
    }
  }, [hotel, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    const getParsedValue = (val: string) => {
      if (type !== "number") return val;
      if (val === "" || val === "-") return 0;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    if (name.includes("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location!,
          [locationField]: getParsedValue(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : getParsedValue(value),
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    // If it's a newly selected file
    const totalPreviousImages = (formData.images || []).length;
    if (index >= totalPreviousImages) {
      const fileIndex = index - totalPreviousImages;
      setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    } else {
      // If it's an existing image from the backend
      setFormData((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index),
      }));
    }
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let allImages = [...(formData.images || [])];

      // Upload new files if any
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map((file) =>
          contentApi.uploadImage(file)
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        allImages = [...allImages, ...uploadedUrls];
      }

      onSubmit({
        ...formData,
        images: allImages,
      });
    } catch (error) {
      console.error("Failed to upload images:", error);
      toast.error("Failed to upload one or more images");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {hotel ? "Edit Hotel" : "Add New Hotel"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Basic Info */}
              <div className="space-y-4 sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Property Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                    >
                      <option value="hotel">Hotel</option>
                      <option value="resort">Resort</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="Hostel">Hostel</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    name="propertyCategory"
                    value={formData.propertyCategory}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Resort">Resort</option>
                    <option value="Mid-range">Mid-range</option>
                    <option value="Budget">Budget</option>
                  </select>
                </div>
                {/* <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating (1-5)</label>
                                    <input
                                        type="number"
                                        name="hotelRating"
                                        min="1"
                                        max="5"
                                        step="0.5"
                                        value={formData.hotelRating || ""}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Rating</label>
                                    <input
                                        type="number"
                                        name="confidenceRating"
                                        min="0"
                                        step="0.1"
                                        value={formData.confidenceRating || ""}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">TripAdvisor Rating (0-5)</label>
                                    <input
                                        type="number"
                                        name="tripAdvisorRating"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={formData.tripAdvisorRating || ""}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                    />
                                </div> */}
              </div>

              <div className="space-y-4 sm:col-span-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="hotelDetails"
                    rows={3}
                    value={formData.hotelDetails}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price Range (Low - High)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="lowRate"
                      placeholder="Low"
                      value={formData.lowRate === 0 ? "" : formData.lowRate}
                      onChange={handleChange}
                      className="w-1/2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                    />
                    <input
                      type="number"
                      name="highRate"
                      placeholder="High"
                      value={formData.highRate === 0 ? "" : formData.highRate}
                      onChange={handleChange}
                      className="w-1/2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Featured / Best Seller
                  </label>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4 sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                  Location Details
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location?.address}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      City
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location?.city}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="location.stateProvinceCode"
                        value={formData.location?.stateProvinceCode}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Country Code
                      </label>
                      <input
                        type="text"
                        name="location.countryCode"
                        value={formData.location?.countryCode}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Latitude
                      </label>
                      <input
                        type="number"
                        name="location.latitude"
                        step="any"
                        value={
                          formData.location?.latitude === 0
                            ? ""
                            : formData.location?.latitude
                        }
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Longitude
                      </label>
                      <input
                        type="number"
                        name="location.longitude"
                        step="any"
                        value={
                          formData.location?.longitude === 0
                            ? ""
                            : formData.location?.longitude
                        }
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4 sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                  Hotel Images
                </h3>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 group"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors bg-gray-50 dark:bg-gray-800/50 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-gray-400 group-hover:text-brand-500 mb-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-brand-500">
                      Add Image
                    </span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="px-6 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading || isUploading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                    <span>Saving...</span>
                  </>
                ) : hotel ? (
                  "Update Hotel"
                ) : (
                  "Add Hotel"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
