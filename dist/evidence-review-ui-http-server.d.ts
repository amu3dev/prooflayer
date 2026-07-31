import { type Server } from "node:http";
interface EvidenceReviewUiHttpRuntime {
    mode: "product" | "review";
    host: string;
    port: number;
    origin: string;
    authority: string;
    batchId?: string;
    claimIds: ReadonlySet<string>;
    readOnly: boolean;
    csrfSecret: string;
    astroServerEntryPath: string;
}
export declare function evidenceReviewUiHttpRuntime(environment?: NodeJS.ProcessEnv): EvidenceReviewUiHttpRuntime;
export declare function startEvidenceReviewUiHttpServer(environment?: NodeJS.ProcessEnv): Promise<Server>;
export declare function isEvidenceReviewUiLoopbackAddress(address: string | undefined): boolean;
export {};
