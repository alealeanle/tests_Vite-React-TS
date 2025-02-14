export type User = {
  id: number;
  username: string;
  is_admin: boolean;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  error: string | null;
  registrationSuccess: boolean;
  loading: boolean;
};

export type UserAuthData = {
  username: string;
  password: string;
};
