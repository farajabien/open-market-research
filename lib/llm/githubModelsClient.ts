// Note: Using built-in fetch (available in Node.js 18+ and browsers)
// import * as fs from "fs";
// import * as path from "path";

export interface GitHubOptions {
  model: string;
  modelCandidates?: string[];
  temperature?: number;
  maxTokens?: number;
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class GitHubModelsClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl =
      process.env.GITHUB_MODELS_BASE_URL ||
      "https://models.github.ai/inference";
    this.token =
      process.env.MYCONTEXT_GITHUB_TOKEN || process.env.GITHUB_TOKEN || null;

    if (!this.token) {
      const loaded = this.loadTokenFromEnvFiles();
      if (loaded) {
        this.token = loaded;
      }
    }
  }

  hasApiKey(): boolean {
    return !!this.token;
  }

  /**
   * Load token from environment variables
   * In browser environment, we rely on environment variables being set at build time
   */
  private loadTokenFromEnvFiles(): string | null {
    // In browser environment, we can't read files directly
    // Environment variables should be set at build time
    return null;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (this.token) h.Authorization = `Bearer ${this.token}`;
    return h;
  }

  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({
          model: process.env.MYCONTEXT_MODEL || "grok-3",
          messages: [
            { role: "system", content: "ping" },
            { role: "user", content: "ping" },
          ],
          max_completion_tokens: 1,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      // Consider any reachable response as available; details handled at call time
      return this.hasApiKey();
    } catch {
      // If we have a token, allow attempts even if the health probe fails
      return this.hasApiKey();
    }
  }

  async generateText(
    prompt: string,
    opts: Partial<GitHubOptions> = {}
  ): Promise<string> {
    const options: GitHubOptions = {
      model: opts.model || process.env.MYCONTEXT_MODEL || "grok-3",
      modelCandidates:
        opts.modelCandidates ||
        (process.env.MYCONTEXT_MODEL_CANDIDATES
          ? process.env.MYCONTEXT_MODEL_CANDIDATES.split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined),
      temperature: opts.temperature ?? 0.2,
      maxTokens: opts.maxTokens ?? 1024,
    };

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: "You are a concise, expert product/dev assistant.",
      },
      { role: "user", content: prompt },
    ];

    // Get all available models from GitHub Models API
    let allModels: string[] = [];
    try {
      allModels = await this.listModels();
      console.log(
        `[GitHubModelsClient] Successfully fetched ${allModels.length} models from API`
      );
    } catch (error) {
      console.log(
        `[GitHubModelsClient] Could not fetch model list (${error}), using curated set`
      );
    }

    // Build model attempt list: primary, then candidates, then all available models
    const modelsToTry = Array.from(
      new Set([options.model, ...(options.modelCandidates || []), ...allModels])
    );

    const maxRetries = parseInt(
      process.env.MYCONTEXT_GITHUB_RETRIES || "1", // 1 retry to prioritize GitHub Models
      10
    );

    console.log(
      `[GitHubModelsClient] Trying ${modelsToTry.length} models: ${modelsToTry
        .slice(0, 5)
        .join(", ")}${modelsToTry.length > 5 ? "..." : ""}`
    );

    for (const modelName of modelsToTry) {
      let attempt = 0;
      while (attempt <= maxRetries) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout for faster UX
        try {
          const res = await fetch(`${this.baseUrl}/chat/completions`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify({
              model: modelName,
              messages,
              max_completion_tokens: options.maxTokens,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (!res.ok) {
            const txt = await res.text();
            // Handle rate limiting - fail fast for better UX
            if (res.status === 429) {
              const retryHeader = res.headers.get("retry-after");
              let waitSeconds = 5; // Default to 5s for faster UX

              if (retryHeader) {
                const numeric = parseInt(retryHeader, 10);
                if (Number.isFinite(numeric)) {
                  waitSeconds = Math.min(numeric, 10); // Cap at 10s max
                }
              }

              console.log(
                `[GitHubModelsClient] Rate limited. Retry-After=${waitSeconds}s → waiting ${waitSeconds}s (attempt ${
                  attempt + 1
                }/${maxRetries})`
              );

              attempt += 1;
              if (attempt <= maxRetries) {
                await new Promise((r) => setTimeout(r, waitSeconds * 1000));
                continue; // retry loop
              } else {
                // Max retries reached, try next model
                break;
              }
            }
            // Try next candidate for auth/not-found/validation errors
            if (
              (res.status === 401 ||
                res.status === 404 ||
                res.status === 422) &&
              modelsToTry.length > 1
            ) {
              console.log(
                `[GitHubModelsClient] Model ${modelName} failed (HTTP ${res.status}). Trying next candidate...`
              );
              break; // break retry loop and move to next model
            }
            throw new Error(`HTTP ${res.status}: ${txt}`);
          }

          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content ?? "";
          return String(content).trim();
        } catch (err: unknown) {
          clearTimeout(timeout);
          if (err instanceof Error && err.name === "AbortError") {
            throw new Error("GitHub Models timed out after 60s");
          }
          // On network hiccups, allow a single quick retry if configured
          attempt += 1;
          if (attempt <= maxRetries) {
            console.log(
              `[GitHubModelsClient] Error: ${
                err instanceof Error ? err.message : String(err)
              }. Retrying (${attempt}/${maxRetries})...`
            );
            await new Promise((r) => setTimeout(r, 1500));
            continue;
          }
          // Move to next model if available
          if (modelsToTry.length > 1) {
            console.log(
              `[GitHubModelsClient] Model ${modelName} error after retries. Trying next candidate...`
            );
            break;
          }
          throw new Error(
            `GitHub Models request failed: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
      }
    }
    throw new Error("All GitHub Models candidates failed");
  }

  /**
   * Attempt to list available models from GitHub Models. Falls back to a curated set.
   */
  async listModels(): Promise<string[]> {
    // GitHub Models API might not have a models listing endpoint
    // Try a few common endpoints, but don't rely on them
    const candidates = [
      `${this.baseUrl}/models`,
      `${this.baseUrl}/v1/models`,
      `${this.baseUrl}/v1/models?per_page=100`,
      `${this.baseUrl}/models?per_page=100`,
    ];

    for (const url of candidates) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const res = await fetch(url, {
          headers: this.headers(),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          console.log(
            `[GitHubModelsClient] Endpoint ${url} returned ${res.status}`
          );
          continue;
        }

        const data = await res.json();
        console.log(
          `[GitHubModelsClient] Endpoint ${url} response:`,
          JSON.stringify(data).slice(0, 200) + "..."
        );

        // Normalize: support various response formats
        let models: string[] = [];

        if (Array.isArray(data?.data)) {
          models = data.data
            .map((m: unknown) => {
              const model = m as Record<string, unknown>;
              return (model?.id || model?.name || model?.model_id) as string;
            })
            .filter((item: unknown): item is string => Boolean(item));
        } else if (Array.isArray(data?.models)) {
          models = data.models
            .map((m: unknown) => {
              if (typeof m === "string") return m;
              const model = m as Record<string, unknown>;
              return (model?.id || model?.name || model?.model_id) as string;
            })
            .filter((item: unknown): item is string => Boolean(item));
        } else if (Array.isArray(data)) {
          models = data
            .map((m: unknown) => {
              const model = m as Record<string, unknown>;
              return (model?.id || model?.name || model?.model_id) as string;
            })
            .filter((item: unknown): item is string => Boolean(item));
        }

        if (models.length > 0) {
          console.log(
            `[GitHubModelsClient] Found ${models.length} available models from ${url}`
          );
          return models;
        }
      } catch (error) {
        console.log(
          `[GitHubModelsClient] Endpoint ${url} failed:`,
          error instanceof Error ? error.message : String(error)
        );
        continue;
      }
    }

    // Curated fallback set commonly available on GitHub Models
    console.log(
      "[GitHubModelsClient] No models endpoint found, using expanded curated set"
    );
    return [
      process.env.MYCONTEXT_MODEL || "grok-3",
      "openai/gpt-4o",
      "openai/gpt-4o-mini",
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
      "deepseek/DeepSeek-V3-0324",
      "deepseek/DeepSeek-Coder-V2",
      "meta/Llama-4-Scout-17B-16E-Instruct",
      "meta/llama-3.1-8b-instruct",
      "meta/llama-3.1-70b-instruct",
      "mistral-ai/Codestral-2501",
      "mistral-ai/Mistral-7B-Instruct-v0.3",
      "nvidia/llama-3.1-nemotron-70b-instruct",
      "qwen/qwen2.5-coder-32b-instruct",
      "qwen/qwen2.5-coder-7b-instruct",
      "google/gemini-2.0-flash",
      "google/gemini-1.5-pro",
      "microsoft/Phi-3.5-mini-instruct",
      "microsoft/Phi-3-medium-128k-instruct",
    ];
  }

  async generateComponent(
    prompt: string,
    opts?: Partial<GitHubOptions>
  ): Promise<string> {
    return this.generateText(
      `Generate a single React component. Output only a code block.\n\n${prompt}`,
      opts
    );
  }

  async generateComponentRefinement(
    componentCode: string,
    prompt: string,
    opts?: Partial<GitHubOptions>
  ): Promise<string> {
    return this.generateText(
      `Refine the following React component with the prompt. Return only a single code block.\n\nComponent:\n\`\`\`tsx\n${componentCode}\n\`\`\`\n\nPrompt: ${prompt}`,
      opts
    );
  }
}
