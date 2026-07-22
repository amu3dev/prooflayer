export declare const RESUME_SECTION_NAMES: readonly ["Summary", "Career Through-Line", "Product & Technical Strengths", "Technical Fluency", "Current Product & AI Initiatives", "Professional Experience", "Enterprise Engineering Foundation", "Education & Certifications", "Additional Information"];
export type ResumeSectionName = typeof RESUME_SECTION_NAMES[number];
export type ParsedResumeEntry = {
    name: string;
    sourceSection?: ResumeSectionName;
    role?: string;
    company?: string;
    dateRange?: string;
    location?: string;
    bullets: string[];
};
export type ParsedResumeLine = {
    text: string;
    sourceSection: ResumeSectionName;
};
export type ParsedResume = {
    headings: string[];
    summaryParagraphs: string[];
    summaryEntries: ParsedResumeLine[];
    strengthLines: string[];
    skillLines: string[];
    projects: ParsedResumeEntry[];
    experiences: ParsedResumeEntry[];
    educationLines: string[];
    additionalLines: string[];
    ignoredHeadings: number;
    ignoredFragments: number;
    warnings: string[];
};
export declare function isMarkdownResume(text: string): boolean;
export declare function isResumeSectionHeading(value: string): boolean;
export declare function isDateLocationLine(value: string): boolean;
export declare function parseMarkdownResume(text: string): ParsedResume;
