"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { TARGET_AUDIENCES, type StudySubmission } from "@/lib/types/database";

interface AudienceStepProps {
  data: Partial<StudySubmission>;
  onUpdate: (data: Partial<StudySubmission>) => void;
}

const AUDIENCE_LABELS: Record<string, string> = {
  real_estate_agent: "Real Estate Agent",
  small_business_owner: "Small Business Owner",
  startup_founder: "Startup Founder",
  product_manager: "Product Manager",
  marketing_manager: "Marketing Manager",
  sales_representative: "Sales Representative",
  customer_service_rep: "Customer Service Rep",
  developer: "Developer",
  designer: "Designer",
  consultant: "Consultant",
  investor: "Investor",
  student: "Student",
  researcher: "Researcher",
  freelancer: "Freelancer",
  enterprise_executive: "Enterprise Executive",
  non_profit_worker: "Non-profit Worker",
  government_employee: "Government Employee",
  other: "Other",
};

export default function AudienceStep({ data, onUpdate }: AudienceStepProps) {
  const selectedAudiences = data.target_audience || [];

  const handleChange = (field: keyof StudySubmission, value: unknown) => {
    onUpdate({ [field]: value });
  };

  const toggleAudience = (audience: string) => {
    const newAudiences = selectedAudiences.includes(audience)
      ? selectedAudiences.filter((a) => a !== audience)
      : [...selectedAudiences, audience];
    handleChange("target_audience", newAudiences);
  };

  const removeAudience = (audience: string) => {
    handleChange(
      "target_audience",
      selectedAudiences.filter((a) => a !== audience)
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Target Audience *</Label>
          <p className="text-sm text-muted-foreground">
            Select all audience types that this research focuses on
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {TARGET_AUDIENCES.map((audience) => (
            <div key={audience} className="flex items-center space-x-2">
              <Checkbox
                id={audience}
                checked={selectedAudiences.includes(audience)}
                onCheckedChange={() => toggleAudience(audience)}
              />
              <Label
                htmlFor={audience}
                className="text-sm font-normal cursor-pointer"
              >
                {AUDIENCE_LABELS[audience] || audience}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {selectedAudiences.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Audiences</Label>
          <div className="flex flex-wrap gap-2">
            {selectedAudiences.map((audience) => (
              <Badge key={audience} variant="secondary" className="gap-1">
                {AUDIENCE_LABELS[audience] || audience}
                <button
                  type="button"
                  onClick={() => removeAudience(audience)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
