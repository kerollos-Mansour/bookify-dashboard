"use client";

import React, { useState, useEffect } from "react";
import { Category, contentApi } from "@/services/api/content.api";
import CategoryForm from "@/components/categories/CategoryForm";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const suggestedCategories = [
    { name: "Beach", slug: "beach", description: "Sun, sand, and crystal clear waters" },
    { name: "Culture", slug: "culture", description: "Immerse yourself in history and traditions" },
    { name: "Ski", slug: "ski", description: "Top-rated slopes and winter adventures" },
    { name: "Family", slug: "family", description: "Best picks for a memorable family trip" },
    { name: "Wellness", slug: "wellness", description: "Relax and rejuvenate your body and mind" },
  ];

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await contentApi.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await contentApi.deleteCategory(id);
      alert("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const handleSubmit = async (data: Partial<Category>) => {
    try {
      if (editingCategory) {
        await contentApi.updateCategory(editingCategory._id, data);
        alert("Category updated successfully");
      } else {
        await contentApi.createCategory(data);
        alert("Category created successfully");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(editingCategory ? "Failed to update category" : "Failed to create category");
    }
  };

  const handleSeed = async () => {
    if (!confirm("Add suggested categories to your database?")) return;
    setIsLoading(true);
    try {
      for (const cat of suggestedCategories) {
        await contentApi.createCategory(cat);
      }
      alert("Suggested categories added successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error seeding categories:", error);
      alert("Failed to seed categories. Some might already exist.");
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Categories
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage property categories like Beach, Culture, Ski, etc.
          </p>
        </div>
        <div className="flex gap-3">
          {categories.length === 0 && !isLoading && (
            <button
              onClick={handleSeed}
              className="px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20 transition-colors"
            >
              Seed Suggestions
            </button>
          )}
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-800/50 dark:border-gray-800"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 group relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                    {category.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {category.description && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {category.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full ${category.isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }`}>
                  {category.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-gray-400">
                  Order: {category.displayOrder}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No categories found. Click "Add Category" to create one.
          </p>
        </div>
      )}

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={isModalOpen}
        initialData={editingCategory || undefined}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

