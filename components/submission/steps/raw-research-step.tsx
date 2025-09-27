"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  CheckCircle,
  AlertCircle,
  Wand2,
  FileText,
  Sparkles,
} from "lucide-react";
import { StudySubmission } from "@/lib/types/database";
import { useResearchStructurer } from "@/hooks/use-research-structurer";

interface RawResearchStepProps {
  data: Partial<StudySubmission>;
  onUpdate: (data: Partial<StudySubmission>) => void;
}

export default function RawResearchStep({
  data,
  onUpdate,
}: RawResearchStepProps) {
  const [rawContent, setRawContent] = useState(data.raw_data || "");
  const [rawTitle, setRawTitle] = useState("");
  const [isStructured, setIsStructured] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    isStructuring,
    isAvailable,
    error,
    confidence,
    checkAvailability,
    structureResearch,
    reset,
  } = useResearchStructurer();

  // Check availability on mount
  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleStructure = async () => {
    if (!rawContent.trim()) {
      return;
    }

    const result = await structureResearch(rawContent, rawTitle || undefined);

    if (result.success && result.data) {
      // Merge the structured data with existing data
      onUpdate({
        ...data,
        ...result.data,
        raw_data: rawContent, // Keep the original raw data
      });
      setIsStructured(true);
      setShowPreview(true);
    }
  };

  const handleSkip = () => {
    // If user skips, just save the raw data
    onUpdate({
      ...data,
      raw_data: rawContent,
    });
  };

  const handleReset = () => {
    setRawContent("");
    setRawTitle("");
    setIsStructured(false);
    setShowPreview(false);
    reset();
  };

  const canProceed = () => {
    return rawContent.trim().length > 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bot className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Research Structuring</h2>
        </div>
        <p className="text-muted-foreground">
          Paste your raw research data and let our AI structure it for you, or
          skip to fill out manually.
        </p>
      </div>

      {/* Service Status */}
      <Alert
        className={
          isAvailable
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }
      >
        <div className="flex items-center gap-2">
          {isAvailable ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>
            {isAvailable
              ? "AI structuring service is available"
              : "AI structuring service is currently unavailable. You can still proceed manually."}
          </AlertDescription>
        </div>
      </Alert>

      {/* Raw Research Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Raw Research Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="raw-title">Research Title (Optional)</Label>
            <Input
              id="raw-title"
              placeholder="Enter a title for your research"
              value={rawTitle}
              onChange={(e) => setRawTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="raw-content">Research Content *</Label>
            <Textarea
              id="raw-content"
              placeholder="Paste your research data here... (interviews, survey results, notes, reports, etc.)"
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="mt-1 min-h-[200px]"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Include any research data: interview transcripts, survey
              responses, field notes, reports, or other raw research materials.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleStructure}
              disabled={!canProceed() || isStructuring || !isAvailable}
              className="flex-1"
            >
              {isStructuring ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Structuring...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Structure with AI
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={!canProceed()}
            >
              Skip & Fill Manually
            </Button>

            {isStructured && (
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {isStructured && confidence && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p>Research successfully structured!</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Confidence:</span>
                    <Badge variant="outline" className="text-green-700">
                      {confidence}%
                    </Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Preview Structured Data */}
      {showPreview && isStructured && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Structured Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.title && (
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm text-muted-foreground">{data.title}</p>
                </div>
              )}

              {data.summary && (
                <div>
                  <Label className="text-sm font-medium">Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    {data.summary}
                  </p>
                </div>
              )}

              {data.industry && (
                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <Badge variant="outline">{data.industry}</Badge>
                </div>
              )}

              {data.countries && data.countries.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Countries</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.countries.map((country, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.top_findings && data.top_findings.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Key Findings</Label>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    {data.top_findings.slice(0, 3).map((finding, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.tags && data.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.tags.slice(0, 5).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Next:</strong> Review and refine the structured data in
                the following steps. You can edit any field that was
                automatically filled.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
