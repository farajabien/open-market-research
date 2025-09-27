"use client";

import { useState, useCallback } from "react";
import { StudySubmission } from "@/lib/types/database";

export interface StructuringState {
  isStructuring: boolean;
  isAvailable: boolean;
  error: string | null;
  confidence: number | null;
}

export interface StructuringResult {
  success: boolean;
  data?: Partial<StudySubmission>;
  error?: string;
  confidence?: number;
}

export function useResearchStructurer() {
  const [state, setState] = useState<StructuringState>({
    isStructuring: false,
    isAvailable: false,
    error: null,
    confidence: null
  });

  // Check if the LLM service is available
  const checkAvailability = useCallback(async () => {
    try {
      const response = await fetch("/api/structure-research");
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        isAvailable: data.available,
        error: data.available ? null : "LLM service is not available"
      }));

      return data.available;
    } catch (error) {
      console.error("Error checking LLM availability:", error);
      setState(prev => ({
        ...prev,
        isAvailable: false,
        error: "Failed to check service availability"
      }));
      return false;
    }
  }, []);

  // Structure raw research data
  const structureResearch = useCallback(async (
    content: string,
    title?: string,
    metadata?: Record<string, any>
  ): Promise<StructuringResult> => {
    setState(prev => ({
      ...prev,
      isStructuring: true,
      error: null
    }));

    try {
      const response = await fetch("/api/structure-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          title,
          metadata
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to structure research");
      }

      setState(prev => ({
        ...prev,
        isStructuring: false,
        confidence: data.confidence || null,
        error: null
      }));

      return {
        success: true,
        data: data.data,
        confidence: data.confidence
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      setState(prev => ({
        ...prev,
        isStructuring: false,
        error: errorMessage
      }));

      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  // Reset the state
  const reset = useCallback(() => {
    setState({
      isStructuring: false,
      isAvailable: false,
      error: null,
      confidence: null
    });
  }, []);

  return {
    ...state,
    checkAvailability,
    structureResearch,
    reset
  };
}
