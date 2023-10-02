import { Action, createReducer, on } from "@ngrx/store";
import { setIsAdmin, setIsJobCreator, setIsLoggedIn, loadUserDataSuccess } from "../actions/auth.action";
import { User } from "src/app/services/authentication-service/authentication.service";
import { JobState } from "./job.reducer";


export interface AuthState {
    isLoggedIn: boolean;
    isJobCreator: boolean;
    isAdmin: boolean;
    userProfile: User | null;
}

export const initialState: AuthState = {
    isLoggedIn: false,
    isJobCreator: false,
    isAdmin: false,
    userProfile: null
}

export const authReducer = createReducer(
    initialState,
    on(setIsLoggedIn, (state, { isLoggedIn }) => ({ ...state, isLoggedIn })),
    on(setIsJobCreator, (state, { isJobCreator }) => ({ ...state, isJobCreator })),
    on(setIsAdmin, (state, { isAdmin }) => ({ ...state, isAdmin })),
    on(loadUserDataSuccess, (state, { userProfile }) => ({ ...state, userProfile }))
);

export function reducer(state: AuthState, action: Action) {
    return authReducer(state, action);
}
