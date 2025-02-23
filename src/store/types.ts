export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
  }
  
  export interface UserState {
    name: string;
    email: string;
  }
  