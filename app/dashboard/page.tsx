"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Zap, Loader2 } from "lucide-react";
import { CreateTicketForm } from "@/components/dashboard/create-ticket-form";
import { MLResultsDialog } from "@/components/dashboard/ml-results-dialog";
import { TicketHistoryList } from "@/components/dashboard/ticket-history-list";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { dashboardApi } from "@/lib/api/dashboard";
import { healthApi } from "@/lib/api/health";
import type { AnalysisResult } from "@/types/api";

export default function DashboardPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const queryClient = useQueryClient();
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.fetchDashboardStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch ticket history
  const {
    data: history,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ["ticket-history"],
    queryFn: () => dashboardApi.fetchTicketHistory(1, 10),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Check API health
  const { data: health } = useQuery({
    queryKey: ["api-health"],
    queryFn: () => healthApi.getHealth(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Handle ticket creation result - refresh data
  const handleTicketResult = (result: AnalysisResult) => {
    setCurrentResult(result);
    setResultsOpen(true);
    // Invalidate and refetch queries to show new ticket in history
    queryClient.invalidateQueries({ queryKey: ["ticket-history"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight" suppressHydrationWarning>
          {t.dashboard.title}
        </h2>
        <p className="text-muted-foreground" suppressHydrationWarning>
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white shadow-md border-t-4 border-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.dashboard.stats.totalTickets}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : statsError ? (
              <div className="text-2xl font-bold text-destructive">Error</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.total_tickets ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {t.dashboard.stats.processedTickets}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-t-4 border-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.dashboard.stats.successRate}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : statsError ? (
              <div className="text-2xl font-bold text-destructive">Error</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.success_rate !== undefined
                    ? `${(stats.success_rate * 100).toFixed(1)}%`
                    : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.dashboard.stats.classificationAccuracy}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border-t-4 border-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.dashboard.stats.apiStatus}
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {health ? (
              <>
                <div
                  className={`text-2xl font-bold ${
                    health.status === "healthy" && health.models_loaded
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {health.status === "healthy" && health.models_loaded
                    ? "Online"
                    : "Degraded"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.dashboard.stats.backendConnection}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <p className="text-xs text-muted-foreground">
                  {t.dashboard.stats.backendConnection}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.createTicket.title}</CardTitle>
            <CardDescription>
              {t.dashboard.createTicket.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => setCreateTicketOpen(true)}
            >
              {t.dashboard.createTicket.button}
            </Button>
          </CardContent>
        </Card>

        <TicketHistoryList
          items={history ?? []}
          isLoading={historyLoading}
        />
      </div>

      {/* Create Ticket Dialog */}
      <CreateTicketForm
        open={createTicketOpen}
        onOpenChange={setCreateTicketOpen}
        onResult={handleTicketResult}
      />

      {/* ML Results Dialog */}
      <MLResultsDialog
        open={resultsOpen}
        onOpenChange={setResultsOpen}
        result={currentResult}
      />
    </div>
  );
}
