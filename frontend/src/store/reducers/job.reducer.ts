import { Action, createReducer, on } from "@ngrx/store";
import * as JobActions from '../actions/job.actions'
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { Job } from "src/app/models/job";
import { JobData } from "src/app/models/job-data";


export interface JobState {
    jobData: JobData | null,
    loading: boolean;
    error: any;
}

  
const initialState: JobState = {
    jobData: null,
    loading: false,
    error: null
};

export const jobReducer = createReducer(
    initialState,
    on(JobActions.loadJobData, (state) => ({...state, loading: true})),
    on(JobActions.loadJobDataSuccess, (state, { jobData }) => ({...state, jobData, loading: false})),
    on(JobActions.loadJobDataFailure, (state, {error}) => ({...state, loading: false, error}))
);


export function reducer(state: JobState, action: Action) {
    return jobReducer(state, action);
}