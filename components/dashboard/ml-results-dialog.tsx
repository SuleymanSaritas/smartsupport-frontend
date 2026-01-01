"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import type { AnalysisResult } from "@/types/api";
import { Globe, Award } from "lucide-react";

interface MLResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: AnalysisResult | null;
}

export function MLResultsDialog({
  open,
  onOpenChange,
  result,
}: MLResultsDialogProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.dashboard.results.title}</DialogTitle>
          <DialogDescription>
            {t.dashboard.results.allPredictions}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Language Badge */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t.dashboard.results.language}:
            </span>
            <Badge variant="outline" className="uppercase">
              {result.language}
            </Badge>
          </div>

          {/* Top Prediction Highlight */}
          {result.predictions.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {t.dashboard.results.topPrediction}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">
                      {result.predictions[0].label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {(result.predictions[0].score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={result.predictions[0].score * 100}
                    className="h-3"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Top 3 Predictions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              {t.dashboard.results.allPredictions}
            </h3>
            <div className="space-y-4">
              {result.predictions.map((prediction, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="font-medium">{prediction.label}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {(prediction.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={prediction.score * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sanitized Text (if available) */}
          {result.sanitized_text && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {t.dashboard.results.sanitizedText}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {result.sanitized_text}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

