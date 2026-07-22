import { type ModelGenerationSettings, type ModelIdentity } from "./schemas.js";
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
export declare function loadModelProviderConfiguration(environment?: NodeJS.ProcessEnv): ModelProviderConfiguration;
export declare function createModelProvider(configuration: ModelProviderConfiguration, transport?: FetchLike): InterpretationModelProvider;
export declare function createModelProviderFromEnvironment(environment?: NodeJS.ProcessEnv, transport?: FetchLike): InterpretationModelProvider;
export declare class OpenAICompatibleInterpretationModelProvider implements InterpretationModelProvider {
    readonly providerId = "openai-compatible";
    readonly identity: ModelIdentity;
    readonly settings: ModelGenerationSettings;
    private readonly baseUrl;
    private readonly apiKey?;
    private readonly timeoutMs;
    private readonly transport;
    constructor(configuration: ModelProviderConfiguration, transport?: FetchLike);
    generate(request: ModelInterpretationRequest): Promise<ModelInterpretationResponse>;
}
export declare class FakeInterpretationModelProvider implements InterpretationModelProvider {
    private readonly rawText;
    readonly providerId: string;
    readonly identity: ModelIdentity;
    readonly settings: ModelGenerationSettings;
    callCount: number;
    constructor(rawText: string, options?: {
        providerId?: string;
        model?: string;
        settings?: ModelGenerationSettings;
    });
    generate(): Promise<ModelInterpretationResponse>;
}
export {};
