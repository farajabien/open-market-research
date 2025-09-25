"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { type StudySubmission } from "@/lib/types/database";

interface FindingsStepProps {
  data: Partial<StudySubmission>;
  onUpdate: (data: Partial<StudySubmission>) => void;
}

export default function FindingsStep({ data, onUpdate }: FindingsStepProps) {
  const [newFinding, setNewFinding] = React.useState("");
  const [newInsight, setNewInsight] = React.useState("");

  const topFindings = data.top_findings || [];
  const insights = data.insights || [];

  const handleChange = (field: keyof StudySubmission, value: unknown) => {
    onUpdate({ [field]: value });
  };

  const addFinding = () => {
    if (newFinding.trim()) {
      handleChange("top_findings", [...topFindings, newFinding.trim()]);
      setNewFinding("");
    }
  };

  const removeFinding = (index: number) => {
    handleChange(
      "top_findings",
      topFindings.filter((_, i) => i !== index)
    );
  };

  const addInsight = () => {
    if (newInsight.trim()) {
      handleChange("insights", [...insights, newInsight.trim()]);
      setNewInsight("");
    }
  };

  const removeInsight = (index: number) => {
    handleChange(
      "insights",
      insights.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Findings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Top Findings *</Label>
          <p className="text-sm text-muted-foreground">
            Key discoveries from your research (at least 3 recommended)
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={newFinding}
              onChange={(e) => setNewFinding(e.target.value)}
              placeholder="e.g., Getting access to fresh vacant units is the #1 challenge"
              rows={2}
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                  addFinding();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFinding}
              disabled={!newFinding.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Press Ctrl+Enter to add quickly
          </p>
        </div>

        {topFindings.length > 0 && (
          <div className="space-y-2">
            {topFindings.map((finding, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-muted rounded-md"
              >
                <span className="text-sm font-medium text-muted-foreground min-w-[20px]">
                  {index + 1}.
                </span>
                <span className="text-sm flex-1">{finding}</span>
                <button
                  type="button"
                  onClick={() => removeFinding(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Key Insights</Label>
          <p className="text-sm text-muted-foreground">
            Deeper analysis and implications of your findings
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={newInsight}
              onChange={(e) => setNewInsight(e.target.value)}
              placeholder="e.g., Agents compete for limited inventory due to real-time vacancy updates"
              rows={2}
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                  addInsight();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInsight}
              disabled={!newInsight.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Press Ctrl+Enter to add quickly
          </p>
        </div>

        {insights.length > 0 && (
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-muted rounded-md"
              >
                <span className="text-sm font-medium text-muted-foreground min-w-[20px]">
                  {index + 1}.
                </span>
                <span className="text-sm flex-1">{insight}</span>
                <button
                  type="button"
                  onClick={() => removeInsight(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
