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
import { INDUSTRIES, type StudySubmission } from "@/lib/types/database";

interface BasicInfoStepProps {
  data: Partial<StudySubmission>;
  onUpdate: (data: Partial<StudySubmission>) => void;
}

export default function BasicInfoStep({ data, onUpdate }: BasicInfoStepProps) {
  const handleChange = (field: keyof StudySubmission, value: unknown) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Research Title *</Label>
        <Input
          id="title"
          value={data.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Real Estate Agent Challenges in Nairobi"
          required
        />
        <p className="text-sm text-muted-foreground">
          A clear, descriptive title for your research study
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary *</Label>
        <Textarea
          id="summary"
          value={data.summary || ""}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="Brief overview of your research findings..."
          rows={4}
          required
        />
        <p className="text-sm text-muted-foreground">
          A concise summary of your research and key findings (2-3 sentences)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry *</Label>
        <Select
          value={data.industry || ""}
          onValueChange={(value) => handleChange("industry", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          The primary industry this research focuses on
        </p>
      </div>
    </div>
  );
}
