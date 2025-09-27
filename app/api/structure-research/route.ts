import { NextRequest, NextResponse } from "next/server";
import { researchStructurer, RawResearchData } from "@/lib/llm/research-structurer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title, metadata } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: "Content is required and must be a string" },
        { status: 400 }
      );
    }

    const rawData: RawResearchData = {
      title,
      content,
      metadata
    };

    const result = await researchStructurer.structureResearch(rawData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to structure research data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      confidence: result.confidence
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isAvailable = await researchStructurer.isAvailable();
    
    return NextResponse.json({
      available: isAvailable,
      message: isAvailable 
        ? "LLM service is available" 
        : "LLM service is not available"
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to check service availability" },
      { status: 500 }
    );
  }
}
