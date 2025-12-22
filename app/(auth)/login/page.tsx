"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 text-white flex-col justify-between p-12 overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold tracking-tight">Bookify Admin</h1>
                </div>
                <div className="relative z-10">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Manage your destinations, bookings, and users efficiently with the dashboard.&rdquo;
                        </p>
                    </blockquote>
                </div>
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center"></div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center bg-white dark:bg-black p-8">
                <div className="w-full max-w-sm space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                            Login to Dashboard
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Enter your admin credentials below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="admin@bookify.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
                        >
                            {isLoading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
