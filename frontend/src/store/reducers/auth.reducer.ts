import { createReducer, on } from "@ngrx/store";
import { setIsJobCreator, setIsLoggedIn } from "../actions/auth.action";
import { inject } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication-service/authentication.service";
import { from, map, of } from "rxjs";

export interface AuthState {
    isLoggedIn: boolean;
    isJobCreator: boolean;
}

export const initialState: AuthState = {
    isLoggedIn: false,
    isJobCreator: false
}

export const authReducer = createReducer(
    initialState,
    on(setIsLoggedIn, (state, {isLoggedIn}) => ({...state, isLoggedIn})),
    on(setIsJobCreator, (state, {isJobCreator}) => ({...state, isJobCreator}))
);
