"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SUBMISSION_STEPS, type StudySubmission } from "@/lib/types/database";
import RawResearchStep from "./steps/raw-research-step";
import BasicInfoStep from "./steps/basic-info-step";
import MarketStep from "./steps/market-step";
import AudienceStep from "./steps/audience-step";
import MethodologyStep from "./steps/methodology-step";
import FindingsStep from "./steps/findings-step";
import MetadataStep from "./steps/metadata-step";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";
import { allRoutes } from "@/lib/auth/routes";
import type { AuthUser } from "@/lib/types/auth";

interface SubmissionFormProps {
  user: AuthUser;
}

export default function SubmissionForm({ user }: SubmissionFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<StudySubmission>>({});
  const router = useRouter();

  const totalSteps = SUBMISSION_STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateFormData = (stepData: Partial<StudySubmission>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const studyData = {
        ...formData,
        published_date: now,
        created_at: now,
        updated_at: now,
        created_by: user.id,
        verification_status: "pending" as const,
      };

      await db.transact(db.tx.studies[id()].update(studyData));

      // Note: Profile submission count will be updated when user views their profile
      // For now, we'll just create/update the profile with basic info
      try {
        const profileId = id();
        await db.transact([
          db.tx.profiles[profileId].update({
            created_at: now,
            updated_at: now,
          }),
          db.tx.$users[user.id].link({ profile: profileId }),
        ]);
      } catch (error) {
        // Profile might already exist, that's okay
        console.log("Profile update skipped:", error);
      }

      router.push(`${allRoutes.STUDIES}?submitted=true`);
    } catch (error) {
      console.error("Error submitting study:", error);
      alert("Failed to submit study. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <RawResearchStep data={formData} onUpdate={updateFormData} />;
      case 1:
        return <BasicInfoStep data={formData} onUpdate={updateFormData} />;
      case 2:
        return <MarketStep data={formData} onUpdate={updateFormData} />;
      case 3:
        return <AudienceStep data={formData} onUpdate={updateFormData} />;
      case 4:
        return <MethodologyStep data={formData} onUpdate={updateFormData} />;
      case 5:
        return <FindingsStep data={formData} onUpdate={updateFormData} />;
      case 6:
        return <MetadataStep data={formData} onUpdate={updateFormData} />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        // Raw research step - can proceed if there's raw data or user skips
        return formData.raw_data && formData.raw_data.length > 0;
      case 1:
        return formData.title && formData.summary && formData.industry;
      case 2:
        return formData.countries && formData.countries.length > 0;
      case 3:
        return formData.target_audience && formData.target_audience.length > 0;
      case 4:
        return formData.methodology?.type && formData.methodology?.sample_size;
      case 5:
        return formData.top_findings && formData.top_findings.length > 0;
      case 6:
        return formData.license;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{SUBMISSION_STEPS[currentStep].title}</CardTitle>
          <p className="text-muted-foreground">
            {SUBMISSION_STEPS[currentStep].description}
          </p>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep === totalSteps - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Research"}
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate unique IDs
function id(): string {
  return Math.random().toString(36).substr(2, 9);
}
