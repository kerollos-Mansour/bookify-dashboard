"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth.api";

interface User {
    _id: string;
    username: string;
    email: string;
    role?: "user" | "admin";
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const data = await authApi.login(email, password);

            console.log("Login API Response Data:", data);

            const token = data.accessToken || data.token;

            if (!token) {
                throw new Error("No access token received.");
            }

            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            console.log("Decoded Token:", decodedToken);

            const isTokenAdmin = decodedToken.isAdmin === true || decodedToken.role === "admin";
            const isUserAdmin = data.user.role === "admin" || data.user.isAdmin === true;

            if (!isTokenAdmin && !isUserAdmin) {
                throw new Error("Access denied. Admin privileges required.");
            }

            setToken(token);
            const userWithRole = { ...data.user, isAdmin: isTokenAdmin };
            setUser(userWithRole);

            localStorage.setItem("authToken", token);
            localStorage.setItem("authUser", JSON.stringify(userWithRole));

            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
