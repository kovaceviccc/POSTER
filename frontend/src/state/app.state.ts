import { AuthState } from "src/store/reducers/auth.reducer";
import { JobState } from "src/store/reducers/job.reducer";

export interface AppState {
    job: JobState,
    authState: AuthState
}