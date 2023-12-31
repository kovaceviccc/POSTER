
export class JobPostDetails {
    id: string;
    jobTitle: string;
    jobDescription: string;
    postedAtUTC: Date;
    applicationsCount: Number;
    creatorName: string;
    jobsByCreatorCount: Number;
    creatorId?:string;
}