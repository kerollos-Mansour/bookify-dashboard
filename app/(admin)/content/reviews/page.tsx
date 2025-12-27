"use client";

import React, { useEffect, useState } from "react";
import { contentApi, Review } from "@/services/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";

type TabStatus = "pending" | "approved" | "rejected";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>("pending");

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getAllReviews({ status: activeTab });
      if (data && data.reviews) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (id: string, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        await contentApi.approveReview(id);
        toast.success("Review approved");
      } else {
        await contentApi.rejectReview(id);
        toast.success("Review rejected");
      }
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error(`Error ${action}ing review:`, error);
      toast.error(`Failed to ${action} review`);
    }
  };

  const tabs: { label: string; value: TabStatus }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Reviews Moderation
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and moderate user-submitted reviews
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.value
              ? "text-brand-500 border-brand-500"
              : "text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 rounded-full border-brand-500 border-t-transparent animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-brand-500">
                      <span className="text-sm font-medium">
                        {((review.userid as any)?.username || (review.userid as any)?.name || (review.userid as string) || "JD").substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {(review.userid as any)?.username || (review.userid as any)?.name || (review.userid as string) || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(review.hotelid as any)?.name || (review.hotelid as string) || "Unknown Hotel"} •{" "}
                        {(() => {
                          try {
                            const date = new Date(review.createdAt || (review as any).reviewDate);
                            if (isNaN(date.getTime())) return "Invalid date";
                            return formatDistanceToNow(date, { addSuffix: true });
                          } catch (e) {
                            return "Invalid date";
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= review.rating
                          ? "text-warning-500"
                          : "text-gray-300 dark:text-gray-700"
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>

                {activeTab === "pending" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleModeration(review._id, "approve")}
                      className="px-3 py-1.5 text-sm font-medium text-success-600 bg-success-50 rounded-lg hover:bg-success-100 dark:bg-success-500/20 dark:text-success-400 dark:hover:bg-success-500/30 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleModeration(review._id, "reject")}
                      className="px-3 py-1.5 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 dark:bg-error-500/20 dark:text-error-400 dark:hover:bg-error-500/30 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {activeTab !== "pending" && (
                  <div className="ml-4">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${activeTab === "approved"
                        ? "bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-400"
                        : "bg-error-50 text-error-600 dark:bg-error-500/20 dark:text-error-400"
                        }`}
                    >
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No {activeTab} reviews found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
