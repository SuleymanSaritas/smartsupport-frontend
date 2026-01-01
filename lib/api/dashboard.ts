import apiClient from "../axios";
import type { DashboardStats, TicketHistoryResponse } from "@/types/api";

/**
 * API functions for dashboard operations
 */

export const dashboardApi = {
  /**
   * Fetch dashboard statistics
   */
  fetchDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>("/api/v1/stats");
    return response.data;
  },

  /**
   * Fetch ticket history
   * The API returns an array directly
   */
  fetchTicketHistory: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<TicketHistoryResponse> => {
    const response = await apiClient.get<TicketHistoryResponse>(
      `/api/v1/history?page=${page}&page_size=${pageSize}`
    );
    // API returns array directly, not wrapped in an object
    return response.data;
  },
};

