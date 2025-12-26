import apiClient from "./client";

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    token?: string;
    user: {
        _id: string;
        id?: string;
        username: string;
        email: string;
        role?: "user" | "admin";
        isAdmin?: boolean;
    };
}

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post("/auth/login", { email, password });
        console.log("Login Response Data:", response.data);

        if (response.data.data) {
            return response.data.data;
        }

        return response.data;
    },
};
