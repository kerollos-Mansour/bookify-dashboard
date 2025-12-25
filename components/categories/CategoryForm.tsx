import React, { useState, useEffect } from "react";
import { Category } from "@/services/api/content.api";

interface CategoryFormProps {
    initialData?: Partial<Category>;
    onSubmit: (data: Partial<Category>) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export default function CategoryForm({
    initialData,
    onSubmit,
    onCancel,
    isOpen,
}: CategoryFormProps) {
    const [formData, setFormData] = useState<Partial<Category>>({
        name: "",
        slug: "",
        description: "",
        image: "",
        isActive: true,
        displayOrder: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                slug: initialData.slug || "",
                description: initialData.description || "",
                image: initialData.image || "",
                isActive: initialData.isActive ?? true,
                displayOrder: initialData.displayOrder || 0,
            });
        } else {
            setFormData({
                name: "",
                slug: "",
                description: "",
                image: "",
                isActive: true,
                displayOrder: 0,
            });
        }
    }, [initialData, isOpen]);

    // Auto-generate slug from name
    useEffect(() => {
        if (!initialData && formData.name) {
            const generatedSlug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setFormData((prev) => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.name, initialData]);

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
                        {initialData ? "Edit Category" : "Add New Category"}
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
                            placeholder="e.g. Beachfront"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Slug
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.slug || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, slug: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. beachfront"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Label (Description)
                        </label>
                        <input
                            type="text"
                            value={formData.description || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder='e.g. "Best for Families"'
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={formData.displayOrder || 0}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        displayOrder: parseInt(e.target.value),
                                    })
                                }
                                className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive || false}
                                onChange={(e) =>
                                    setFormData({ ...formData, isActive: e.target.checked })
                                }
                                className="w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
                            />
                            <label
                                htmlFor="isActive"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Is Active
                            </label>
                        </div>
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
                            {initialData ? "Save Changes" : "Add Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
