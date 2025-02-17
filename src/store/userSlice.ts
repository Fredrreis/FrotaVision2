import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { normalizeString } from '../modules/normalizeString';

interface UserState {
    username: string;
    isAuthenticated: boolean;
}

interface LoginPayload {
    username: string;
    password: string;
}

const initialState: UserState = {
    username: '',
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<LoginPayload>) => {
            action.payload.username = normalizeString(action.payload.username, { caseType: "normal", removeSpaces: true, removeSpecialChars: true });
            action.payload.password = normalizeString(action.payload.password, { caseType: "normal", removeSpecialChars: true });

            const { username, password } = action.payload;
            
            if(username === 'admin' && password === 'admin') {
                state.username = username;
                state.isAuthenticated = true;
            } else {
                state.username = '';
                state.isAuthenticated = false;
            }
        },
        logout: (state) => {
            state.username = '';
            state.isAuthenticated = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
