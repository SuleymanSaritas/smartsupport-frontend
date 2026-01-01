"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { formatRelativeTime, truncateText } from "@/lib/utils/date";
import type { TicketHistoryItem } from "@/types/api";
import { Clock } from "lucide-react";

interface TicketHistoryListProps {
  items: TicketHistoryItem[];
  isLoading?: boolean;
}

// Use primary green color for intent badges
const getIntentColor = (): string => {
  return "bg-primary text-primary-foreground border-primary/20";
};

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
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border bg-white hover:bg-accent/50 transition-colors space-y-3"
            >
              {/* Header: Original Text (Bold) + Intent Badge (Right side) */}
              <div className="flex items-start justify-between gap-4">
                <p className="font-semibold text-gray-800 flex-1">
                  {item.text}
                </p>
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
              </div>

              {/* Middle: Translated Text (Italic, Gray) - Only if available */}
              {item.translated_text && (
                <p className="text-sm text-gray-500 italic">
                  {item.translated_text}
                </p>
              )}

              {/* Bottom: AI Response - Highlighted with light green background */}
              <div className="bg-green-50 border-l-4 border-primary rounded-r p-3 mt-2">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item.response_text}
                </p>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(item.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

