
export class JobDetails {

    id: string = null!;
    jobTitle: string = null!;
    jobDescription: string = null!;
    postedAtUTC: Date = null!;
    applicationsCount?: Number = null!;
    createdBy: string = null!;
    jobsByCreatorCount?: Number;
}