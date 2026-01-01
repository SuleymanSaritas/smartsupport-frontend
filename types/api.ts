/**
 * TypeScript types mirroring the FastAPI Pydantic models
 * These types ensure type safety between frontend and backend
 */

export enum TaskStatus {
  PENDING = "PENDING",
  STARTED = "STARTED",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  RETRY = "RETRY",
  REVOKED = "REVOKED",
}

export interface TicketInput {
  text: string;
}

export interface Prediction {
  label: string;
  score: number; // Confidence score between 0.0 and 1.0
}

export interface AnalysisResult {
  language: string;
  intent: string; // Top predicted intent (for backward compatibility)
  confidence: number; // Top prediction confidence (for backward compatibility)
  predictions: Prediction[]; // Top 3 predicted labels with confidence scores
  sanitized_text?: string | null;
}

export interface TaskResponse {
  task_id: string;
  status: string;
  message: string;
}

export interface TaskStatusResponse {
  task_id: string;
  status: TaskStatus;
  result?: AnalysisResult | null;
  error?: string | null;
}

export interface HealthCheckResponse {
  status: string;
  models_loaded: boolean;
}

export interface RootResponse {
  message: string;
  version: string;
  status: string;
}

export interface DashboardStats {
  total_tickets: number;
  active_tasks: number;
  success_rate: number;
  api_status: "healthy" | "unhealthy";
}

export interface TicketHistoryItem {
  id: number;
  text: string; // The user's original input
  intent: string;
  confidence: number;
  language: string;
  response_text: string; // The AI's natural language answer
  translated_text?: string; // The English translation of the user's query (optional)
  created_at: string;
}

// The API returns an array directly, not a paginated response
export type TicketHistoryResponse = TicketHistoryItem[];


