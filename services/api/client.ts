import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { API_CONFIG } from "../../config/api.config";

// Base API configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally and refresh tokens
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && response.data.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;

        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );

          if (response.data && response.data.data) {
            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;

            // Store new tokens
            if (typeof window !== "undefined") {
              localStorage.setItem("authToken", accessToken);
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // Update the failed request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // Retry the original request
            return apiClient(originalRequest);
          }
        }

        // No refresh token or refresh failed - logout
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } catch (refreshError) {
        // Refresh token failed - logout
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error("Access forbidden - insufficient permissions");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("An error occurred:", error.response.data);
      }
    } else if (error.request) {
      console.error("No response received from server");
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
