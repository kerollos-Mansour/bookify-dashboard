import React, { useState, useEffect } from "react";
import { Destination } from "@/services/api/content.api";

interface DestinationFormProps {
    initialData?: Partial<Destination>;
    onSubmit: (data: Partial<Destination>) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export default function DestinationForm({
    initialData,
    onSubmit,
    onCancel,
    isOpen,
}: DestinationFormProps) {
    const [formData, setFormData] = useState<Partial<Destination>>({
        name: "",
        location: "",
        price: "",
        image: "",
        categoryId: "",
        bestSeller: false,
        rating: 0,
        address: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                location: initialData.location || "",
                price: initialData.price || "",
                image: initialData.image || "",
                categoryId: initialData.categoryId || "",
                bestSeller: initialData.bestSeller || false,
                rating: initialData.rating || 0,
                address: initialData.address || "",
            });
        } else {
            setFormData({
                name: "",
                location: "",
                price: "",
                image: "",
                categoryId: "",
                bestSeller: false,
                rating: 0,
                address: "",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {initialData ? "Edit Destination" : "Add New Destination"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. Paris"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Location
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.location || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. France"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Price
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.price || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, price: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. $1000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Image URL
                        </label>
                        <input
                            type="url"
                            value={formData.image || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, image: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category ID
                        </label>
                        <input
                            type="text"
                            value={formData.categoryId || ""}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Category ID"
                        />
                        {/* Note: In a real app we would fetch categories and show a select */}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Rating (0-5)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.rating || 0}
                            onChange={(e) =>
                                setFormData({ ...formData, rating: parseFloat(e.target.value) })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Address
                        </label>
                        <input
                            type="text"
                            value={formData.address || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, address: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Full address"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="bestSeller"
                            checked={formData.bestSeller || false}
                            onChange={(e) =>
                                setFormData({ ...formData, bestSeller: e.target.checked })
                            }
                            className="w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
                        />
                        <label
                            htmlFor="bestSeller"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Best Seller
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
                        >
                            {initialData ? "Save Changes" : "Add Destination"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
