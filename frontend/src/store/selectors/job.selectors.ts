import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JobState } from '../reducers/job.reducer';
import { AppState } from 'src/state/app.state';
import { JobData } from 'src/app/models/job-data';


export const selectJobFeature = createFeatureSelector<JobState>('job')

// export const selectJobData = (state: AppState) : JobData => state.job.jobData;
// export const selectJobLoading = (state: AppState) => state.job.loading;
// export const selectJobError = (state: AppState) => state.job.error;

export const selectJobData = createSelector(selectJobFeature, (state) => state.jobData);
export const selectJobLoading = createSelector(selectJobFeature, (state) => state.loading);
export const selectJobError = createSelector(selectJobFeature, (state) => state.error);