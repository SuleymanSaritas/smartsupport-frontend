import apiClient from "../axios";
import type {
  TicketInput,
  TaskResponse,
  TaskStatusResponse,
} from "@/types/api";

/**
 * API functions for ticket operations
 */

export const ticketsApi = {
  /**
   * Create a new ticket classification task
   */
  createTicket: async (data: TicketInput): Promise<TaskResponse> => {
    const response = await apiClient.post<TaskResponse>(
      "/api/v1/tickets",
      data
    );
    return response.data;
  },

  /**
   * Get the status of a ticket classification task
   */
  getTicketStatus: async (taskId: string): Promise<TaskStatusResponse> => {
    const response = await apiClient.get<TaskStatusResponse>(
      `/api/v1/tickets/status/${taskId}`
    );
    return response.data;
  },
};


