import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  ModelGenerationSettingsSchema,
  ModelIdentitySchema,
  type ModelGenerationSettings,
  type ModelIdentity,
} from "./schemas.js";

export interface ModelInterpretationRequest {
  renderedPrompt: string;
  settings: ModelGenerationSettings;
}

export interface ModelInterpretationResponse {
  rawText: string;
}

export interface InterpretationModelProvider {
  readonly providerId: string;
  readonly identity: ModelIdentity;
  readonly settings: ModelGenerationSettings;
  generate(request: ModelInterpretationRequest): Promise<ModelInterpretationResponse>;
}

export interface ModelProviderConfiguration {
  providerId: string;
  model: string;
  baseUrl?: string;
  apiKey?: string;
  timeoutMs: number;
  settings: ModelGenerationSettings;
  fakeResponsePath?: string;
}

type FetchLike = typeof fetch;

const DEFAULT_SETTINGS: ModelGenerationSettings = {
  temperature: 0,
  maxOutputTokens: 4096,
  responseFormat: "json_object",
};

export function loadModelProviderConfiguration(
  environment: NodeJS.ProcessEnv = process.env,
): ModelProviderConfiguration {
  const providerId = required(environment.PROOFLAYER_MODEL_PROVIDER, "PROOFLAYER_MODEL_PROVIDER");
  const model = providerId === "fake"
    ? normalize(environment.PROOFLAYER_MODEL_NAME) ?? "fake-model"
    : required(environment.PROOFLAYER_MODEL_NAME, "PROOFLAYER_MODEL_NAME");
  const timeoutText = normalize(environment.PROOFLAYER_MODEL_TIMEOUT_MS) ?? "30000";
  const timeoutMs = Number(timeoutText);
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("PROOFLAYER_MODEL_TIMEOUT_MS must be a positive integer.");
  }
  const configuration: ModelProviderConfiguration = {
    providerId,
    model,
    timeoutMs,
    settings: ModelGenerationSettingsSchema.parse(DEFAULT_SETTINGS),
  };
  if (providerId === "openai-compatible") {
    configuration.baseUrl = required(
      environment.PROOFLAYER_MODEL_BASE_URL,
      "PROOFLAYER_MODEL_BASE_URL",
    );
    configuration.apiKey = normalize(environment.PROOFLAYER_MODEL_API_KEY);
  } else if (providerId === "fake") {
    configuration.fakeResponsePath = required(
      environment.PROOFLAYER_MODEL_RESPONSE_FILE,
      "PROOFLAYER_MODEL_RESPONSE_FILE",
    );
  } else {
    throw new Error(
      `Unsupported model provider: ${providerId}. Supported providers: openai-compatible, fake.`,
    );
  }
  return configuration;
}

export function createModelProvider(
  configuration: ModelProviderConfiguration,
  transport: FetchLike = fetch,
): InterpretationModelProvider {
  if (configuration.providerId === "openai-compatible") {
    return new OpenAICompatibleInterpretationModelProvider(configuration, transport);
  }
  if (configuration.providerId === "fake" && configuration.fakeResponsePath) {
    return new FileInterpretationModelProvider(
      configuration.fakeResponsePath,
      configuration.model,
      configuration.settings,
    );
  }
  throw new Error(`Unsupported model provider configuration: ${configuration.providerId}`);
}

export function createModelProviderFromEnvironment(
  environment: NodeJS.ProcessEnv = process.env,
  transport: FetchLike = fetch,
): InterpretationModelProvider {
  return createModelProvider(loadModelProviderConfiguration(environment), transport);
}

export class OpenAICompatibleInterpretationModelProvider implements InterpretationModelProvider {
  readonly providerId = "openai-compatible";
  readonly identity: ModelIdentity;
  readonly settings: ModelGenerationSettings;
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs: number;
  private readonly transport: FetchLike;

  constructor(configuration: ModelProviderConfiguration, transport: FetchLike = fetch) {
    if (!configuration.baseUrl) throw new Error("OpenAI-compatible provider requires a base URL.");
    this.identity = ModelIdentitySchema.parse({
      provider: this.providerId,
      model: configuration.model,
      endpointType: "chat-completions",
    });
    this.settings = ModelGenerationSettingsSchema.parse(configuration.settings);
    this.baseUrl = configuration.baseUrl.replace(/\/+$/, "");
    this.apiKey = configuration.apiKey;
    this.timeoutMs = configuration.timeoutMs;
    this.transport = transport;
  }

  async generate(request: ModelInterpretationRequest): Promise<ModelInterpretationResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.transport(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: this.identity.model,
          messages: [{ role: "user", content: request.renderedPrompt }],
          ...(request.settings.temperature !== undefined
            ? { temperature: request.settings.temperature }
            : {}),
          ...(request.settings.topP !== undefined ? { top_p: request.settings.topP } : {}),
          ...(request.settings.maxOutputTokens !== undefined
            ? { max_tokens: request.settings.maxOutputTokens }
            : {}),
          ...(request.settings.seed !== undefined ? { seed: request.settings.seed } : {}),
          ...(request.settings.responseFormat === "json_object"
            ? { response_format: { type: "json_object" } }
            : {}),
        }),
        signal: controller.signal,
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Model provider authentication failed.");
        }
        if (response.status === 429) throw new Error("Model provider rate limit reached.");
        if (response.status === 404) throw new Error("Configured model or endpoint is unavailable.");
        throw new Error(`Model provider request failed with HTTP ${response.status}.`);
      }
      const payload = await response.json() as {
        choices?: Array<{ message?: { content?: unknown }; finish_reason?: string }>;
      };
      const choice = payload.choices?.[0];
      if (choice?.finish_reason === "length") {
        throw new Error("Model provider response was truncated by the output-token limit.");
      }
      if (typeof choice?.message?.content !== "string" || choice.message.content.length === 0) {
        throw new Error("Model provider returned an empty response.");
      }
      return { rawText: choice.message.content };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Model provider timed out after ${this.timeoutMs} ms.`);
      }
      if (error instanceof Error) throw error;
      throw new Error("Model provider transport failed.");
    } finally {
      clearTimeout(timeout);
    }
  }
}

export class FakeInterpretationModelProvider implements InterpretationModelProvider {
  readonly providerId: string;
  readonly identity: ModelIdentity;
  readonly settings: ModelGenerationSettings;
  callCount = 0;

  constructor(
    private readonly rawText: string,
    options: {
      providerId?: string;
      model?: string;
      settings?: ModelGenerationSettings;
    } = {},
  ) {
    this.providerId = options.providerId ?? "fake";
    this.identity = ModelIdentitySchema.parse({
      provider: this.providerId,
      model: options.model ?? "fake-model",
      endpointType: "in-memory",
    });
    this.settings = ModelGenerationSettingsSchema.parse(options.settings ?? DEFAULT_SETTINGS);
  }

  async generate(): Promise<ModelInterpretationResponse> {
    this.callCount += 1;
    return { rawText: this.rawText };
  }
}

class FileInterpretationModelProvider implements InterpretationModelProvider {
  readonly providerId = "fake";
  readonly identity: ModelIdentity;

  constructor(
    private readonly responsePath: string,
    model: string,
    readonly settings: ModelGenerationSettings,
  ) {
    this.identity = ModelIdentitySchema.parse({
      provider: this.providerId,
      model,
      endpointType: "file-replay",
    });
  }

  async generate(): Promise<ModelInterpretationResponse> {
    const absolutePath = path.resolve(this.responsePath);
    const rawText = await readFile(absolutePath, "utf8");
    if (rawText.length === 0) throw new Error("Fake model response file is empty.");
    return { rawText };
  }
}

function normalize(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function required(value: string | undefined, name: string): string {
  const normalized = normalize(value);
  if (!normalized) throw new Error(`${name} is required for model-assisted interpretation.`);
  return normalized;
}
