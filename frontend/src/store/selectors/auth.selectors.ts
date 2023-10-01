import { createFeature, createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../reducers/auth.reducer";

export const selectAuthFeature = createFeatureSelector<AuthState>('auth');
export const selectIsLoggedIn = createSelector(selectAuthFeature, (state) => state.isLoggedIn);
export const selectIsJobCreator = createSelector(selectAuthFeature, (state) => state.isJobCreator);
export const selectIsAdmin = createSelector(selectAuthFeature, (state) => state.isAdmin);
export const selectUserProfile = createSelector(selectAuthFeature, (state) => state.userProfile);