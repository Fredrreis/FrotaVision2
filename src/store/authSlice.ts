    import { createSlice, PayloadAction } from '@reduxjs/toolkit';
    import { AuthState } from './types';
    import { SessionData } from '@/session';

    const initialState: AuthState = {
        isAuthenticated: false,
        expiresIn: null,
        user: null,
        error: null,
        issuedDate: undefined
    }

    const authSlice = createSlice({
        name: 'auth',
        initialState,
        reducers: {
            loginSuccess: (state, action: PayloadAction<SessionData>) => {
                state.isAuthenticated = true;
                state.user = { name: action.payload.userInfo!.name, token: action.payload.access_token!, email: action.payload.userInfo!.email };
                state.expiresIn = action.payload.expiresIn;
                state.error = null;
                //Vommit
                state.issuedDate = new Date()
            },
            refreshToken: (state, action: PayloadAction<SessionData>) => {
                if(state.user){
                    state.user = { ...state.user, token: action.payload.access_token! };
                    state.expiresIn = action.payload.expiresIn;
                }
            },
            loginFailure: (state, action: PayloadAction<string>) => {
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            },
            logout: () => initialState,
        },
    });

    export const { loginSuccess, loginFailure, logout } = authSlice.actions;
    export default authSlice.reducer;