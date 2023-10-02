import { createAction, props } from "@ngrx/store";
import { User } from "src/app/services/authentication-service/authentication.service";

export const checkIsLoggedIn = createAction('[Auth] Check Is Logged In');
export const setIsLoggedIn = createAction('[Auth] Set Is Logged In', (isLoggedIn: boolean) => ({ isLoggedIn }));

export const checkIsJobCreator = createAction('[Auth] Check Is Job Creator');
export const setIsJobCreator = createAction('[Auth] Set Is Job Creator', (isJobCreator: boolean) => ({ isJobCreator }));

export const checkIsAdmin = createAction('[Auth] Check Is Admin');
export const setIsAdmin = createAction('[Auth] Set Is Admin', (isAdmin: boolean) => ({ isAdmin }));

export const loadUserData = createAction('[Auth] Load User Data');
export const loadUserDataSuccess = createAction('[Auth] Get User Profile', (userProfile: User | null) => ({ userProfile }));