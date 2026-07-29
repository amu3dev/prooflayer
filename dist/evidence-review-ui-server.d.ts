import { type ChildProcess } from "node:child_process";
import { type EvidenceReviewUiBatch } from "./evidence-review-ui.js";
export interface EvidenceReviewUiLaunchOptions {
    workspace: string;
    batchId: string;
    host?: string;
    port?: number;
    open?: boolean;
    readOnly?: boolean;
}
export interface PreparedEvidenceReviewUiLaunch {
    workspace: string;
    batch: EvidenceReviewUiBatch;
    host: string;
    port: number;
    url: string;
    readOnly: boolean;
    serverEntryPath: string;
}
interface EvidenceReviewUiLauncherDependencies {
    findPort?: (host: string, startPort: number) => Promise<number>;
    spawnServer?: (entryPath: string, environment: NodeJS.ProcessEnv) => ChildProcess;
    openBrowser?: (url: string) => Promise<void>;
    waitUntilReady?: (url: string, child: ChildProcess) => Promise<void>;
}
export declare function prepareEvidenceReviewUiLaunch(options: EvidenceReviewUiLaunchOptions, dependencies?: EvidenceReviewUiLauncherDependencies): Promise<PreparedEvidenceReviewUiLaunch>;
export declare function launchEvidenceReviewUi(options: EvidenceReviewUiLaunchOptions, dependencies?: EvidenceReviewUiLauncherDependencies): Promise<{
    prepared: PreparedEvidenceReviewUiLaunch;
    child: ChildProcess;
}>;
export declare function formatEvidenceReviewUiLaunch(prepared: PreparedEvidenceReviewUiLaunch): string;
export declare function waitForEvidenceReviewUiExit(child: ChildProcess): Promise<void>;
export declare function assertLoopbackHost(host: string): void;
export declare function findAvailableLoopbackPort(host: string, startPort: number): Promise<number>;
export {};
