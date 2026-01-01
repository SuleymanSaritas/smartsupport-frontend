import apiClient from "../axios";
import type { HealthCheckResponse, RootResponse } from "@/types/api";

/**
 * API functions for health checks
 */

export const healthApi = {
  /**
   * Check root endpoint
   */
  getRoot: async (): Promise<RootResponse> => {
    const response = await apiClient.get<RootResponse>("/");
    return response.data;
  },

  /**
   * Check health endpoint
   */
  getHealth: async (): Promise<HealthCheckResponse> => {
    const response = await apiClient.get<HealthCheckResponse>("/health");
    return response.data;
  },
};


