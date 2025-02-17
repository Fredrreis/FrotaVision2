//Should be same as SessionDatas???
//Vommit
export interface AuthState {
    isAuthenticated: boolean;
    expiresIn: number | null;
    user: { name: string, token: string, email: string } | null;
    error: string | null;
    issuedDate: Date | undefined;
}

export interface MenuState {
    currentMenu: string;
    isLoaded: boolean;
}