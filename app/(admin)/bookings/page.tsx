"use client";
import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { bookingsApi, Booking, GetBookingsParams } from "@/services/api";
import BookingDetailsModal from "@/components/bookings/BookingDetailsModal";
import EditBookingModal from "@/components/bookings/EditBookingModal";

function formatDate(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours: string | number = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
}

function getStatusBadgeClass(status: string) {
    switch (status.toLowerCase()) {
        case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "confirmed":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        case "cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "completed":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
}

function getPaymentStatusBadgeClass(status: string) {
    switch (status.toLowerCase()) {
        case "paid":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "unpaid":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "failed":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
}

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    selectedValue: string;
    onSelect: any;
    isOpen: boolean;
    onToggle: () => void;
    buttonClassName?: string;
}

function DropdownMenu({
    options,
    selectedValue,
    onSelect,
    isOpen,
    onToggle,
    buttonClassName = "px-4 py-2 rounded-lg bg-brand-300 text-gray-800 flex items-center",
}: DropdownProps) {
    return (
        <div className="relative inline-block text-left">
            <button
                onClick={onToggle}
                className={buttonClassName}
                type="button"
            >
                <span className="whitespace-nowrap">{selectedValue}</span>
                <svg
                    className="w-4 h-4 ms-1.5 -me-0.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 9-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 rounded-base shadow-lg w-44 mt-2 text-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
                    <ul className="p-2 text-sm text-body font-medium">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded cursor-pointer"
                                onClick={() => {
                                    onSelect(option.value);
                                    onToggle();
                                }}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<Booking["status"] | "">("");
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(
        null
    );
    const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
        null
    );
    const [searchBy, setSearchBy] =
        useState<GetBookingsParams["searchBy"]>("Booking Number");
    const [bookingStatusFilter, setBookingStatusFilter] = useState<
        Record<string, Booking["status"] | "">
    >({});
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editingBookingId, setEditingBookingId] = useState<string | null>(
        null
    );
    const [editingBooking, setEditingBooking] = useState<any>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const toggleDropdown = () => setIsSearchDropdownOpen((prev) => !prev);
    const toggleStatusDropdown = (bookingId: string) => {
        setOpenStatusDropdown((prev) =>
            prev === bookingId ? null : bookingId
        );
    };

    const openBookingModal = async (bookingId: string) => {
        try {
            setModalLoading(true);
            setModalOpen(true);
            const details = await bookingsApi.getBookingById(bookingId);
            setSelectedBooking(details);
        } catch (error) {
            console.error("Failed to fetch booking details", error);
            toast.error("Failed to load booking details");
            setModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    const closeBookingModal = () => {
        setModalOpen(false);
        setSelectedBooking(null);
    };

    const openEditModal = async (bookingId: string) => {
        try {
            setEditingBookingId(bookingId);
            const details = await bookingsApi.getBookingById(bookingId);
            setEditingBooking(details);
            setEditModalOpen(true);
            setModalOpen(false);
        } catch (error) {
            console.error("Failed to fetch booking details for edit", error);
            toast.error("Failed to load booking for editing");
        }
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditingBooking(null);
        setEditingBookingId(null);
    };

    const handleSaveBooking = async (updatedData: any) => {
        try {
            if (!editingBookingId) return;

            // Call the API to update the booking status
            await bookingsApi.updateBooking(editingBookingId, updatedData);

            // Update the bookings array locally
            setBookings((prev) =>
                prev.map((booking) =>
                    booking._id === editingBookingId
                        ? { ...booking, ...updatedData }
                        : booking
                )
            );
            toast.success("Booking updated successfully");
            closeEditModal();
        } catch (error) {
            console.error("Failed to update booking", error);
            toast.error("Failed to update booking. Please try again.");
        }
    };

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        try {
            setUpdatingBookingId(bookingId);

            // Update in backend
            await bookingsApi.updateBookingStatus(
                bookingId,
                newStatus as Booking["status"]
            );

            // Update bookings array to reflect the change
            setBookings((prev) =>
                prev.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status: newStatus as Booking["status"] }
                        : booking
                )
            );

            setOpenStatusDropdown(null);
            toast.success("Booking status updated successfully");
        } catch (error) {
            console.error("Failed to update booking status", error);
            toast.error("Failed to update booking status. Please try again.");
        } finally {
            setUpdatingBookingId(null);
        }
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const data = await bookingsApi.getAllBookings({
                    status: status || undefined,
                    search: search || undefined,
                    startDate: startDate || undefined,
                    searchBy: searchBy,
                });
                // adjust this line if backend response shape is different
                const bookingsArray = Array.isArray(data) ? data : [];

                setBookings(bookingsArray);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [status, search, searchBy, startDate, editModalOpen]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Booking Management
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Track and manage customer bookings
                </p>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setStatus("")}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${
        status === ""
            ? "text-brand-500 border-b-2 border-brand-500"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
    }`}
                >
                    All
                </button>

                <button
                    onClick={() => setStatus("pending")}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${
        status === "pending"
            ? "text-brand-500 border-b-2 border-brand-500"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
    }`}
                >
                    Pending
                </button>

                <button
                    onClick={() => setStatus("confirmed")}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${
        status === "confirmed"
            ? "text-brand-500 border-b-2 border-brand-500"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
    }`}
                >
                    Confirmed
                </button>

                <button
                    onClick={() => setStatus("cancelled")}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${
        status === "cancelled"
            ? "text-brand-500 border-b-2 border-brand-500 "
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
    }`}
                >
                    Cancelled
                </button>

                <button
                    onClick={() => setStatus("completed")}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap
    ${
        status === "completed"
            ? "text-brand-500 border-b-2 border-brand-500"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
    }`}
                >
                    Completed
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-xl">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by booking ID, user, or hotel..."
                        className="w-8/12 h-11 rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-4 text-sm mr-2 text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90 dark:placeholder:text-white/30"
                    />
                    <DropdownMenu
                        options={[
                            {
                                label: "Booking Number",
                                value: "Booking Number",
                            },
                            { label: "User Name", value: "User Name" },
                            { label: "Hotel Name", value: "Hotel Name" },
                        ]}
                        selectedValue={searchBy}
                        onSelect={setSearchBy}
                        isOpen={isSearchDropdownOpen}
                        onToggle={toggleDropdown}
                    />
                </div>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90"
                    />
                </div>
            </div>

            {/* Table Placeholder */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                                    #
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                                    Booking Number
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                                    User
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                                    Hotel
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                                    Dates
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                                    Payment
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 1️⃣ Loading */}
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center"
                                    >
                                        <p className="text-sm text-gray-500">
                                            Loading bookings...
                                        </p>
                                    </td>
                                </tr>
                            )}

                            {/* 2️⃣ No Data */}
                            {!loading && bookings.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center"
                                    >
                                        <p className="text-sm text-gray-500">
                                            No bookings found
                                        </p>
                                    </td>
                                </tr>
                            )}

                            {/* 3️⃣ Show Data */}
                            {!loading &&
                                bookings.length > 0 &&
                                bookings.map((booking, i) => (
                                    <tr
                                        key={booking._id}
                                        className="border-t border-gray-200 dark:border-gray-800  dark:hover:bg-gray-800"
                                    >
                                        <td className="px-6 py-4 text-sm dark:text-gray-400">
                                            {i + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm dark:text-gray-400">
                                            {booking.bookingNumber}
                                        </td>
                                        <td className="px-6 py-4 text-sm dark:text-gray-400">
                                            {booking.userId
                                                ? booking.userId.name
                                                : "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 text-sm dark:text-gray-400">
                                            {booking.hotelId
                                                ? booking.hotelId.name
                                                : "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 text-sm dark:text-gray-400">
                                            {formatDate(booking.checkIn)} →{" "}
                                            {formatDate(booking.checkOut)}
                                        </td>
                                        <td className="px-6 py-4 text-sm dark:text-gray-400">
                                            ${booking.totalPrice}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <DropdownMenu
                                                options={[
                                                    {
                                                        label: "Pending",
                                                        value: "pending",
                                                    },
                                                    {
                                                        label: "Confirmed",
                                                        value: "confirmed",
                                                    },
                                                    {
                                                        label: "Cancelled",
                                                        value: "cancelled",
                                                    },
                                                    {
                                                        label: "Completed",
                                                        value: "completed",
                                                    },
                                                ]}
                                                selectedValue={
                                                    bookingStatusFilter[
                                                        booking._id
                                                    ] || booking.status
                                                }
                                                onSelect={(newStatus) =>
                                                    handleStatusChange(
                                                        booking._id,
                                                        newStatus
                                                    )
                                                }
                                                isOpen={
                                                    openStatusDropdown ===
                                                    booking._id
                                                }
                                                onToggle={() =>
                                                    toggleStatusDropdown(
                                                        booking._id
                                                    )
                                                }
                                                buttonClassName={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusBadgeClass(
                                                    bookingStatusFilter[
                                                        booking._id
                                                    ] || booking.status
                                                )} ${
                                                    updatingBookingId ===
                                                    booking._id
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                            />
                                            {updatingBookingId ===
                                                booking._id && (
                                                <div className="absolute right-0 mt-1">
                                                    <svg
                                                        className="animate-spin h-4 w-4"
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
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadgeClass(
                                                    booking.paymentStatus
                                                )}`}
                                            >
                                                {booking.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm dark:text-gray-400">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openBookingModal(
                                                            booking._id
                                                        );
                                                    }}
                                                    className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-xs font-medium"
                                                >
                                                    Show Details
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditModal(
                                                            booking._id
                                                        );
                                                    }}
                                                    className="px-3 py-1 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-xs font-medium"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Details Modal Component */}
            {/* Booking Details Modal Component */}
            <BookingDetailsModal
                isOpen={modalOpen}
                isLoading={modalLoading}
                booking={selectedBooking}
                onClose={closeBookingModal}
                onEdit={() => openEditModal(selectedBooking?._id)}
            />

            {/* Edit Booking Modal Component */}
            <EditBookingModal
                isOpen={editModalOpen}
                booking={editingBooking}
                onClose={closeEditModal}
                onSave={handleSaveBooking}
            />
        </div>
    );
}
