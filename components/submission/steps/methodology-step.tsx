"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { METHODOLOGY_TYPES, type StudySubmission } from "@/lib/types/database";

interface MethodologyStepProps {
  data: Partial<StudySubmission>;
  onUpdate: (data: Partial<StudySubmission>) => void;
}

const METHODOLOGY_LABELS: Record<string, string> = {
  interview: "Interviews",
  survey: "Survey",
  focus_group: "Focus Group",
  observation: "Observation",
  mixed_methods: "Mixed Methods",
  other: "Other",
};

export default function MethodologyStep({
  data,
  onUpdate,
}: MethodologyStepProps) {
  const methodology = data.methodology || {
    type: "interview" as const,
    sample_size: 0,
    additional_notes: "",
    collection_start: new Date(),
    collection_end: new Date(),
  };

  const handleChange = (field: keyof StudySubmission, value: unknown) => {
    onUpdate({ [field]: value });
  };

  const updateMethodology = (
    field: keyof typeof methodology,
    value: unknown
  ) => {
    handleChange("methodology", {
      ...methodology,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="methodology-type">Research Method *</Label>
        <Select
          value={methodology.type}
          onValueChange={(value) => updateMethodology("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select research method" />
          </SelectTrigger>
          <SelectContent>
            {METHODOLOGY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {METHODOLOGY_LABELS[type] || type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          The primary research method used
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sample-size">Sample Size *</Label>
        <Input
          id="sample-size"
          type="number"
          min="1"
          value={methodology.sample_size || ""}
          onChange={(e) =>
            updateMethodology("sample_size", parseInt(e.target.value) || 0)
          }
          placeholder="e.g., 20"
          required
        />
        <p className="text-sm text-muted-foreground">
          Number of participants or data points
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="collection-start">Collection Start Date *</Label>
          <Input
            id="collection-start"
            type="date"
            value={
              methodology.collection_start
                ? methodology.collection_start.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              updateMethodology("collection_start", new Date(e.target.value))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="collection-end">Collection End Date *</Label>
          <Input
            id="collection-end"
            type="date"
            value={
              methodology.collection_end
                ? methodology.collection_end.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              updateMethodology("collection_end", new Date(e.target.value))
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional-notes">Additional Notes</Label>
        <Textarea
          id="additional-notes"
          value={methodology.additional_notes || ""}
          onChange={(e) =>
            updateMethodology("additional_notes", e.target.value)
          }
          placeholder="Any additional details about your methodology..."
          rows={3}
        />
        <p className="text-sm text-muted-foreground">
          Optional: Additional details about your research process
        </p>
      </div>
    </div>
  );
}
