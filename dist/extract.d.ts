export declare const SUPPORTED_EXTENSIONS: Set<string>;
export declare function extractText(filePath: string): Promise<{
    text: string;
    supported: boolean;
    error?: string;
}>;
