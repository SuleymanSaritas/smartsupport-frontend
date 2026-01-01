import axios from "axios";

/**
 * Axios instance configured for SmartSupport Backend API
 * Uses NEXT_PUBLIC_API_URL from environment variables
 * In development, uses Next.js proxy to avoid CORS issues
 */
const getBaseURL = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  // Use Next.js proxy in development (when API URL is localhost)
  if (
    typeof window !== "undefined" &&
    (apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1"))
  ) {
    return "/api/python";
  }
  
  return apiUrl;
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout for ML processing
});

// Request interceptor for adding API key if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add API key from environment if available
    // The backend requires X-API-Key header for authentication
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers["X-API-Key"] = apiKey;
    } else {
      // Log warning in development if API key is missing
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "⚠️ NEXT_PUBLIC_API_KEY is not set. API requests may fail. " +
          "Add NEXT_PUBLIC_API_KEY to your .env.local file with the same value as API_KEY in the backend .env file."
        );
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data);
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error: No response from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

