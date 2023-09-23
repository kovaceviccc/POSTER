
export interface Job {
    id: string;
    jobTitle: string;
    jobDescription: string;
    postedAtUTC: Date;
    numberOfApplicants: number;
    createdBy: string;
}