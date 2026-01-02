import apiClient from "../axios";
import type {
  TicketInput,
  TaskResponse,
  TaskStatusResponse,
  AnalysisResult,
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

/**
 * Poll ticket status until completion or failure
 * @param taskId - The task ID returned from createTicket
 * @param options - Polling options
 * @returns Promise that resolves with the AnalysisResult when completed
 * @throws Error if task fails or times out
 */
export async function pollTicketStatus(
  taskId: string,
  options: {
    interval?: number; // Polling interval in milliseconds (default: 2000)
    maxAttempts?: number; // Maximum number of polling attempts (default: 60)
  } = {}
): Promise<AnalysisResult> {
  const { interval = 2000, maxAttempts = 60 } = options;

  return new Promise((resolve, reject) => {
    let attempts = 0;

    const poll = async () => {
      attempts++;

      // Check if we've exceeded max attempts before making API call
      if (attempts > maxAttempts) {
        reject(
          new Error(
            `Task polling timeout after ${maxAttempts} attempts (${(maxAttempts * interval) / 1000}s)`
          )
        );
        return;
      }

      try {
        const status = await ticketsApi.getTicketStatus(taskId);

        // Check if task is completed successfully
        if (status.status === "SUCCESS") {
          if (status.result) {
            resolve(status.result);
            return;
          } else {
            reject(new Error("Task completed but no result data available"));
            return;
          }
        }

        // Check if task failed
        if (status.status === "FAILURE") {
          reject(
            new Error(status.error || "Task failed with unknown error")
          );
          return;
        }

        // Continue polling if task is still pending/started
        if (
          status.status === "PENDING" ||
          status.status === "STARTED" ||
          status.status === "RETRY"
        ) {
          setTimeout(poll, interval);
        } else {
          // Unknown status
          reject(new Error(`Unknown task status: ${status.status}`));
        }
      } catch (error: any) {
        // Handle temporary network errors (502, 503, 504) - common during cold starts
        const statusCode = error.response?.status;
        const isTemporaryError = statusCode === 502 || statusCode === 503 || statusCode === 504;

        if (isTemporaryError) {
          // Backend is likely waking up, retry silently
          setTimeout(poll, interval);
          return;
        }

        // For other errors, check if we've hit max attempts
        if (attempts >= maxAttempts) {
          reject(
            new Error(
              `Error polling task status after ${maxAttempts} attempts: ${error.message || "Unknown error"}`
            )
          );
          return;
        }

        // For non-temporary errors, log and continue (might be transient)
        console.warn(`Polling error (attempt ${attempts}/${maxAttempts}):`, error.message);
        setTimeout(poll, interval);
      }
    };

    // Start polling
    poll();
  });
}


