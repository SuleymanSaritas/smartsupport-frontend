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
import { ticketsApi } from "@/lib/api/tickets";
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

  const createTicketMutation = useMutation({
    mutationFn: (data: TicketInput) => ticketsApi.createTicket(data),
    onSuccess: (data) => {
      toast({
        title: t.toast.ticketCreated,
        description: `Task ID: ${data.task_id}`,
      });
      setText("");
      onOpenChange(false);
      // Poll for task status
      pollTaskStatus(data.task_id);
    },
    onError: (error: any) => {
      toast({
        title: t.toast.ticketError,
        description: error.response?.data?.detail || error.message,
        variant: "destructive",
      });
    },
  });

  const pollTaskStatus = async (taskId: string) => {
    const maxAttempts = 60; // Poll for up to 60 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        const status = await ticketsApi.getTicketStatus(taskId);
        
        if (status.status === "SUCCESS" && status.result) {
          toast({
            title: t.toast.taskCompleted,
            description: "Classification completed successfully",
          });
          // Trigger a refetch of all relevant queries
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          queryClient.invalidateQueries({ queryKey: ["ticket-history"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
          // Call onResult callback if provided
          if (onResult && status.result) {
            onResult(status.result);
          }
          return;
        }

        if (status.status === "FAILURE") {
          toast({
            title: t.toast.taskError,
            description: status.error || "Task failed",
            variant: "destructive",
          });
          return;
        }

        // Continue polling if still pending/started
        if (
          (status.status === "PENDING" || status.status === "STARTED") &&
          attempts < maxAttempts
        ) {
          attempts++;
          setTimeout(poll, 1000); // Poll every second
        }
      } catch (error: any) {
        toast({
          title: t.toast.pollingError,
          description: error.message,
          variant: "destructive",
        });
      }
    };

    poll();
  };

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
              disabled={createTicketMutation.isPending}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createTicketMutation.isPending}
            >
              {t.dashboard.createTicket.form.cancel}
            </Button>
            <Button type="submit" disabled={createTicketMutation.isPending}>
              {createTicketMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
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

