"use client";

import React, { useState, useEffect, useRef } from "react";
import { Room, Amenity, hotelsApi } from "@/services/api/hotels.api";
import { contentApi } from "@/services/api/content.api";
import { toast } from "react-hot-toast";

interface RoomFormProps {
    room?: Room | null;
    isOpen: boolean;
    onSubmit: (data: Partial<Room>) => void;
    onCancel: () => void;
    isLoading: boolean;
}

export default function RoomForm({
    room,
    isOpen,
    onSubmit,
    onCancel,
    isLoading,
}: RoomFormProps) {
    const [formData, setFormData] = useState<Partial<Room>>({
        name: "",
        bedType: "single",
        price: {
            original: 0,
            discounted: 0,
            discount: 0,
            currency: "USD"
        },
        quantity: 1,
        status: "available",
        sleeps: 2,
        bedrooms: 1,
        images: [],
        amenities: [],
        allInclusive: false,
        refundable: {
            isRefundable: false,
            deadline: ""
        },
        size: ""
    });

    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const data = await hotelsApi.getAllAmenities();
                setAmenities(data);
            } catch (error) {
                console.error("Failed to fetch amenities:", error);
            }
        };
        fetchAmenities();
    }, []);

    useEffect(() => {
        if (room) {
            setFormData(room);
            setPreviewUrls(room.images || []);
        } else if (isOpen) {
            setFormData({
                name: "",
                bedType: "single",
                price: {
                    original: 0,
                    discounted: 0,
                    discount: 0,
                    currency: "USD"
                },
                quantity: 1,
                status: "available",
                sleeps: 2,
                bedrooms: 1,
                images: [],
                amenities: [],
                allInclusive: false,
                refundable: {
                    isRefundable: false,
                    deadline: ""
                },
                size: ""
            });
            setPreviewUrls([]);
            setSelectedFiles([]);
        }
    }, [room, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement;

        const getParsedValue = (val: string) => {
            if (type !== "number") return val;
            if (val === "" || val === "-") return 0;
            const parsed = parseFloat(val);
            return isNaN(parsed) ? 0 : parsed;
        };

        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : getParsedValue(value);

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev: any) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: val,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: val,
            }));
        }
    };

    const handleAmenityToggle = (amenityId: string) => {
        setFormData((prev) => {
            const currentAmenities = (prev.amenities || []) as any[];
            const isSelected = currentAmenities.some(a => (typeof a === 'string' ? a : a._id) === amenityId);

            let newAmenities: string[];
            if (isSelected) {
                newAmenities = currentAmenities
                    .map(a => typeof a === 'string' ? a : a._id)
                    .filter(id => id !== amenityId);
            } else {
                newAmenities = [...currentAmenities.map(a => typeof a === 'string' ? a : a._id), amenityId];
            }

            return { ...prev, amenities: newAmenities };
        });
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
        const totalPreviousImages = (formData.images || []).length;
        if (index >= totalPreviousImages) {
            const fileIndex = index - totalPreviousImages;
            setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
        } else {
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

            if (selectedFiles.length > 0) {
                const uploadPromises = selectedFiles.map((file) => contentApi.uploadImage(file));
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

    if (!isOpen){
        return null;
    } 

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
        >
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {room ? "Edit Room" : "Add New Room"}
                    </h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Room Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Deluxe Sea View"
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bed Type</label>
                                <select
                                    name="bedType"
                                    value={formData.bedType}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                >
                                    <option value="single">Single</option>
                                    <option value="double">Double</option>
                                    <option value="queen">Queen</option>
                                    <option value="king">King</option>
                                    <option value="twin">Twin</option>
                                    <option value="full">Full</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Size (e.g. 25 sqm)</label>
                                <input
                                    type="text"
                                    name="size"
                                    value={formData.size || ""}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bedrooms</label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    value={formData.bedrooms || ""}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sleeps</label>
                                <input
                                    type="number"
                                    name="sleeps"
                                    value={formData.sleeps || ""}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity || ""}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Pricing</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Original Price</label>
                                <input
                                    type="number"
                                    name="price.original"
                                    value={formData.price?.original === 0 ? "" : formData.price?.original}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discounted Price</label>
                                <input
                                    type="number"
                                    name="price.discounted"
                                    value={formData.price?.discounted === 0 ? "" : formData.price?.discounted}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount (%)</label>
                                <input
                                    type="number"
                                    name="price.discount"
                                    value={formData.price?.discount === 0 ? "" : formData.price?.discount}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                                <select
                                    name="price.currency"
                                    value={formData.price?.currency}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CAD">CAD</option>
                                    <option value="AUD">AUD</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Options & Refundable */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Options & Policies</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="allInclusive"
                                    id="allInclusive"
                                    checked={formData.allInclusive || false}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-gray-200 dark:border-gray-800"
                                />
                                <label htmlFor="allInclusive" className="text-sm font-medium text-gray-700 dark:text-gray-300">All Inclusive</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="refundable.isRefundable"
                                    id="isRefundable"
                                    checked={formData.refundable?.isRefundable || false}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-gray-200 dark:border-gray-800"
                                />
                                <label htmlFor="isRefundable" className="text-sm font-medium text-gray-700 dark:text-gray-300">Refundable</label>
                            </div>
                            {formData.refundable?.isRefundable && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Refund Deadline</label>
                                    <input
                                        type="date"
                                        name="refundable.deadline"
                                        value={formData.refundable?.deadline ? new Date(formData.refundable.deadline).toISOString().split('T')[0] : ""}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-brand-500 focus:outline-hidden"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Amenities</h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {amenities.map((amenity) => {
                                const amenityId = amenity._id;
                                const isSelected = (formData.amenities || []).some(a => (typeof a === 'string' ? a : a._id) === amenityId);
                                return (
                                    <button
                                        key={amenity._id}
                                        type="button"
                                        onClick={() => handleAmenityToggle(amenityId)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${isSelected
                                            ? "bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-400"
                                            : "bg-white border-gray-200 text-gray-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-500/40"
                                            }`}
                                    >
                                        <span className="truncate">{amenity.name}</span>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Room Images</h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 group">
                                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors bg-gray-50 dark:bg-gray-800/50 group"
                            >
                                <svg className="w-8 h-8 text-gray-400 group-hover:text-brand-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <span className="text-xs font-medium text-gray-500 group-hover:text-brand-500">Add Image</span>
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
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
                            className="px-8 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            {(isLoading || isUploading) ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Saving...</span>
                                </>
                            ) : room ? "Update Room" : "Add Room"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
