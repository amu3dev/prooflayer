import { type Server } from "node:http";
interface EvidenceReviewUiHttpRuntime {
    host: string;
    port: number;
    origin: string;
    authority: string;
    astroServerEntryPath: string;
}
export declare function evidenceReviewUiHttpRuntime(environment?: NodeJS.ProcessEnv): EvidenceReviewUiHttpRuntime;
export declare function startEvidenceReviewUiHttpServer(environment?: NodeJS.ProcessEnv): Promise<Server>;
export {};
