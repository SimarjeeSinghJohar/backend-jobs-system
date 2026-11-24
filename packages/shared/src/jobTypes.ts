export enum JobType {
    EMAIL_SEND = "EMAIL_SEND",
    GENERATE_REPORT = "GENERATE_REPORT",
}

export interface SendEmailPayload {
    to: string;
    subject: string;
    body: string;
}

export interface GenerateReportPayload {
    reportId: string;
    filters: Record<string, any>;
    format: "pdf" | "csv" | "xlsx";
}

export type JobPayload = 
    | { type: JobType.EMAIL_SEND; payload: SendEmailPayload }
    | { type: JobType.GENERATE_REPORT; payload: GenerateReportPayload };