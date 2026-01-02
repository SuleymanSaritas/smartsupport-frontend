"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { formatAbsoluteTime } from "@/lib/utils/date";
import type { TicketHistoryItem } from "@/types/api";
import { Clock } from "lucide-react";

interface PredictionDetail {
  label: string;
  score: number;
}

interface TicketHistoryListProps {
  items: TicketHistoryItem[];
  isLoading?: boolean;
}

// Use primary green color for intent badges
const getIntentColor = (): string => {
  return "bg-primary text-primary-foreground border-primary/20";
};

/**
 * Parse prediction_details JSON string
 */
function parsePredictionDetails(predictionDetails?: string): PredictionDetail[] | null {
  if (!predictionDetails) return null;
  try {
    const parsed = JSON.parse(predictionDetails);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 3); // Take top 3
    }
    return null;
  } catch (error) {
    console.error("Error parsing prediction_details:", error);
    return null;
  }
}

export function TicketHistoryList({ items, isLoading }: TicketHistoryListProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.recentActivity.title}</CardTitle>
          <CardDescription>{t.dashboard.recentActivity.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.recentActivity.title}</CardTitle>
          <CardDescription>{t.dashboard.recentActivity.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t.dashboard.recentActivity.noActivity}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.dashboard.recentActivity.title}</CardTitle>
        <CardDescription>{t.dashboard.recentActivity.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => {
            const predictions = parsePredictionDetails(item.prediction_details);
            const hasPredictions = predictions && predictions.length > 0;

            return (
              <div
                key={item.id}
                className="p-4 rounded-lg border bg-white hover:bg-accent/50 transition-colors space-y-3"
              >
                {/* Header: Original Text (Bold) + Intent Badge (Right side) */}
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold text-gray-800 flex-1">
                    {item.text}
                  </p>
                  {!hasPredictions && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={`${getIntentColor()} text-xs font-medium`}
                      >
                        {item.intent}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Middle: Translated Text (Italic, Gray) - Only if available */}
                {item.translated_text && (
                  <p className="text-sm text-gray-500 italic">
                    {item.translated_text}
                  </p>
                )}

                {/* Probabilities Section: Top 3 Predictions with Progress Bars */}
                {hasPredictions ? (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Probabilities
                    </p>
                    <div className="space-y-2">
                      {predictions.map((pred, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-700">
                              {pred.label}
                            </span>
                            <span className="text-muted-foreground">
                              {(pred.score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={pred.score * 100}
                            className="h-1.5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Fallback: Show single intent badge if no prediction_details */
                  <div className="flex items-center gap-2 pt-1">
                    <Badge
                      variant="outline"
                      className={`${getIntentColor()} text-xs font-medium`}
                    >
                      {item.intent}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                )}

                {/* Bottom: AI Response - Highlighted with light green background */}
                <div className="bg-green-50 border-l-4 border-primary rounded-r p-3 mt-2">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.response_text}
                  </p>
                </div>

                {/* Timestamp - Absolute Time in Turkey/Istanbul */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatAbsoluteTime(item.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

