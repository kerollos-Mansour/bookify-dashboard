import axios, { AxiosInstance, AxiosResponse } from "axios";

// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/sessions
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
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

// Response interceptor - Handle errors globally and extract data
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && response.data.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            console.error("Unauthorized - please login again");
            // Optionally redirect to login page
            // window.location.href = "/login";
          }
          break;
        case 403:
          // Forbidden
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
