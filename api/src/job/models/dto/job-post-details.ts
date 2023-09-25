
export interface JobPostDetails {
    id: string;
    jobTitle: string;
    jobDescription: string;
    postedAtUTC: Date;
    applicationsCount: Number;
    createdBy: string;
    jobsByCreatorCount: Number;
}