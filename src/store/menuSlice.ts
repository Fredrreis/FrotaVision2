import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuState } from './types';

const initialState: MenuState = {
    currentMenu: 'home',
    isLoaded: false,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        changeMenu: (state, action: PayloadAction<string>) => {
            state.currentMenu = action.payload;
            state.isLoaded = false;
        },
        loadedMenu: (state, action: PayloadAction<string>) => {
            state.isLoaded = action.payload === state.currentMenu;
        }
    },
});

export const { changeMenu, loadedMenu } = menuSlice.actions;
export default menuSlice.reducer;