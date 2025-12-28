"use client";
import React, { useEffect, useState } from "react";
import {
  dashboardApi,
  DashboardStats,
  RevenueData,
  BookingStatusData,
} from "@/services/api";
import {
  RevenueChart,
  BookingStatusChart,
} from "@/components/charts/DashboardCharts";

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  loading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  loading,
}) => (
  <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg hover:shadow-theme-md dark:bg-gray-900 dark:border-gray-800 group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        {loading ? (
          <div className="mt-2 h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        ) : (
          <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white/90">
            {value}
          </p>
        )}
        <div className="flex items-center gap-1 mt-2">
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-success-600 dark:text-success-400"
                : "text-error-600 dark:text-error-400"
            }`}
          >
            {change}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            vs last month
          </span>
        </div>
      </div>
      <div className="p-3 rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/20 dark:text-brand-400">
        {icon}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 transition-all duration-300 transform scale-x-0 bg-gradient-to-r from-brand-500 to-brand-600 group-hover:scale-x-100"></div>
  </div>
);

// Recent Activity Item
interface Activity {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "booking" | "user" | "cancellation" | "review" | "hotel";
}

const ActivityIcon: React.FC<{ type: Activity["type"] }> = ({ type }) => {
  const iconClass = "w-5 h-5";

  switch (type) {
    case "booking":
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    case "user":
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      );
    case "cancellation":
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    case "review":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    default:
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      );
  }
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [bookingStatusData, setBookingStatusData] = useState<
    BookingStatusData[]
  >([]);
  const [loading, setLoading] = useState(true);

  const recentActivities: Activity[] = [
    {
      id: 1,
      user: "John Doe",
      action: "booked",
      target: "Grand Hotel",
      time: "2 minutes ago",
      type: "booking",
    },
    {
      id: 2,
      user: "Sarah Smith",
      action: "registered",
      target: "new account",
      time: "15 minutes ago",
      type: "user",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "cancelled booking at",
      target: "Beach Resort",
      time: "1 hour ago",
      type: "cancellation",
    },
    {
      id: 4,
      user: "Emily Davis",
      action: "left a review for",
      target: "Mountain Lodge",
      time: "2 hours ago",
      type: "review",
    },
    {
      id: 5,
      user: "Admin",
      action: "added new hotel",
      target: "Sunset Villa",
      time: "3 hours ago",
      type: "hotel",
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, revenue, bookingStatus] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRevenueData(7),
          dashboardApi.getBookingsByStatus(),
        ]);

        setStats(statsData);
        setRevenueData(revenue);
        setBookingStatusData(bookingStatus);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpiData = stats
    ? [
        {
          title: "Total Revenue",
          value: `$${stats.totalRevenue.toLocaleString()}`,
          change: `+${stats.revenueChange}%`,
          trend: "up" as const,
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
        {
          title: "Active Bookings",
          value: stats.activeBookings.toString(),
          change: `+${stats.bookingsChange}%`,
          trend: "up" as const,
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
        },
        {
          title: "Total Users",
          value: stats.totalUsers.toLocaleString(),
          change: `+${stats.usersChange}%`,
          trend: "up" as const,
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
        },
        {
          title: "Total Hotels",
          value: stats.totalHotels.toString(),
          change: `+${stats.hotelsChange}%`,
          trend: "up" as const,
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          ),
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome to Bookify Admin Dashboard
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800"
              >
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="mt-2 h-9 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="mt-2 h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
            ))
          : kpiData.map((kpi, index) => (
              <KPICard key={index} {...kpi} loading={loading} />
            ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
              Revenue Over Time
            </h3>
            <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          {loading || revenueData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <p className="text-sm">
                  {loading
                    ? "Loading chart data..."
                    : "No revenue data available"}
                </p>
              </div>
            </div>
          ) : (
            <RevenueChart data={revenueData} />
          )}
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
              Bookings by Status
            </h3>
          </div>
          {loading || bookingStatusData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <p className="text-sm">
                  {loading
                    ? "Loading chart data..."
                    : "No booking data available"}
                </p>
              </div>
            </div>
          ) : (
            <BookingStatusChart data={bookingStatusData} />
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  activity.type === "booking"
                    ? "bg-brand-50 text-brand-500 dark:bg-brand-500/20 dark:text-brand-400"
                    : activity.type === "user"
                    ? "bg-success-50 text-success-500 dark:bg-success-500/20 dark:text-success-400"
                    : activity.type === "cancellation"
                    ? "bg-error-50 text-error-500 dark:bg-error-500/20 dark:text-error-400"
                    : activity.type === "review"
                    ? "bg-warning-50 text-warning-500 dark:bg-warning-500/20 dark:text-warning-400"
                    : "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                <ActivityIcon type={activity.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-white/90">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
