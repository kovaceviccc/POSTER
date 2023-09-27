import { createAction, props } from "@ngrx/store";
import { JobData } from "src/app/models/job-data";

export const loadJobData = createAction('[Job] Load Job Data', props<{ page: number; size: number }>());
export const loadJobDataSuccess = createAction('[JobData] Load Jobs Success',props<{jobData: JobData}>());
export const loadJobDataFailure = createAction('[JobData] Load Jobs Failure',props<{error: string}>());