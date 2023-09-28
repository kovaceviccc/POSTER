import { createAction } from "@ngrx/store";

export const checkIsLoggedIn = createAction('[Auth] Check Is Logged In');
export const setIsLoggedIn = createAction('[Auth] Set Is Logged In', (isLoggedIn: boolean) =>({isLoggedIn}));

export const checkIsJobCreator = createAction('[Auth] Check Is Job Creator');
export const setIsJobCreator = createAction('[Auth] Set is Job Creator', (isJobCreator: boolean) => ({isJobCreator}));