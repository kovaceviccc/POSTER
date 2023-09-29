import { createReducer, on } from "@ngrx/store";
import { setIsAdmin, setIsJobCreator, setIsLoggedIn } from "../actions/auth.action";

export interface AuthState {
    isLoggedIn: boolean;
    isJobCreator: boolean;
    isAdmin: boolean;
}

export const initialState: AuthState = {
    isLoggedIn: false,
    isJobCreator: false,
    isAdmin: false
}

export const authReducer = createReducer(
    initialState,
    on(setIsLoggedIn, (state, {isLoggedIn}) => ({...state, isLoggedIn})),
    on(setIsJobCreator, (state, {isJobCreator}) => ({...state, isJobCreator})),
    on(setIsAdmin, (state, {isAdmin}) => ({...state, isAdmin}))
);
