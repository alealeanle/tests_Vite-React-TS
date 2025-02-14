import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, UserAuthData } from 'src/types/authTypes';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  error: null,
  registrationSuccess: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, action: PayloadAction<UserAuthData>) => {
      state.error = null;
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAdmin = action.payload.is_admin;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    fetchUserRequest: state => {
      state.error = null;
      state.loading = true;
    },
    fetchUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.is_admin;
      state.loading = false;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutRequest: state => {
      state.error = null;
      state.loading = true;
    },
    logoutSuccess: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.isAdmin = false;
      state.loading = false;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    registerRequest: (
      state,
      action: PayloadAction<
        UserAuthData & { password_confirmation: string; is_admin: boolean }
      >,
    ) => {
      state.error = null;
      state.registrationSuccess = false;
      state.loading = true;
    },
    registerSuccess: state => {
      state.registrationSuccess = true;
      state.loading = false;
    },
    registerEnd: state => {
      state.registrationSuccess = false;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.registrationSuccess = false;
      state.loading = false;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  registerEnd,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
} = authSlice.actions;
export default authSlice.reducer;
