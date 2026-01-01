"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ticketsApi, pollTicketStatus } from "@/lib/api/tickets";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { Loader2 } from "lucide-react";
import type { TicketInput, AnalysisResult } from "@/types/api";

interface CreateTicketFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResult?: (result: AnalysisResult) => void;
}

export function CreateTicketForm({
  open,
  onOpenChange,
  onResult,
}: CreateTicketFormProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  const createTicketMutation = useMutation({
    mutationFn: async (data: TicketInput) => {
      // Create the ticket and get task_id
      const response = await ticketsApi.createTicket(data);
      
      // Show initial toast
      toast({
        title: t.toast.ticketCreated,
        description: "Ticket created, AI is processing...",
      });

      // Start polling for the result
      setIsPolling(true);
      try {
        const result = await pollTicketStatus(response.task_id, {
          interval: 2000, // Poll every 2 seconds
          maxAttempts: 15, // Timeout after 15 attempts (30 seconds)
        });

        // Polling completed successfully
        setIsPolling(false);
        toast({
          title: t.toast.taskCompleted,
          description: "Classification completed successfully",
        });

        // Trigger a refetch of all relevant queries
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
        queryClient.invalidateQueries({ queryKey: ["ticket-history"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

        // Call onResult callback if provided
        if (onResult) {
          onResult(result);
        }

        // Clear form and close dialog
        setText("");
        onOpenChange(false);

        return response;
      } catch (error: any) {
        setIsPolling(false);
        toast({
          title: t.toast.taskError,
          description: error.message || "Task failed or timed out",
          variant: "destructive",
        });
        throw error;
      }
    },
    onError: (error: any) => {
      setIsPolling(false);
      toast({
        title: t.toast.ticketError,
        description: error.response?.data?.detail || error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a ticket description",
        variant: "destructive",
      });
      return;
    }

    createTicketMutation.mutate({ text: text.trim() });
  };

  const isLoading = createTicketMutation.isPending || isPolling;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t.dashboard.createTicket.title}</DialogTitle>
          <DialogDescription>
            {t.dashboard.createTicket.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="ticket-text"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t.dashboard.createTicket.form.textLabel}
            </label>
            <Textarea
              id="ticket-text"
              placeholder={t.dashboard.createTicket.form.textPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              disabled={isLoading}
              required
            />
          </div>
          {isPolling && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is processing your ticket...</span>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t.dashboard.createTicket.form.cancel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPolling ? "Processing..." : "Submitting..."}
                </>
              ) : (
                t.dashboard.createTicket.form.submit
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

