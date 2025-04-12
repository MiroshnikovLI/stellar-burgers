import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';
import { UserState } from './type';

// Асинхронные действия
export const fetchUser = createAsyncThunk('user/fetch', getUserApi);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => loginUserApi(data)
);

export const logoutUser = createAsyncThunk('user/logout', logoutApi);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const checkUserAuth = createAsyncThunk(
  'user/registrationStatus',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((user) => dispatch(setUser(user.user)))
        .finally(() => dispatch(setAuthChecked(true)));
    } else {
      dispatch(setAuthChecked(true));
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

const initialState: UserState = {
  user: null,
  error: '',
  isAuthChecked: false,
  success: false,
  isLoading: false,
  errorBanner: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
    resetUserState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = '';
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.error = action.error?.message ?? 'Unknown error';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.errorBanner = false;
        state.user = action.payload.user;
        state.success = action.payload.success;
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthChecked = false;
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isLoading = false;
        state.errorBanner = true;
        if (action.error?.message)
          state.error = 'Указан неверный адрес электронной почты или пароль';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.error = '';
        state.isLoading = false;
        state.errorBanner = false;
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorBanner = true;
        deleteCookie('accessToken');
        localStorage.clear();
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.success = false;
        state.user = null;
        state.errorBanner = false;
        deleteCookie('accessToken');
        localStorage.clear();
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        if (action.error.message === 'User already exists')
          state.error = 'Пользователь уже существует';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.errorBanner = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {})
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorBanner = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
      });
  }
});

// Селекторы
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectAuthChecked = (state: { user: UserState }) =>
  state.user.isAuthChecked;
export const selectAuthError = (state: { user: UserState }) => state.user.error;
export const selectAuthLoading = (state: { user: UserState }) =>
  state.user.isLoading;
export const selectErrorBanner = (state: { user: UserState }) =>
  state.user.errorBanner;

export const { setAuthChecked, setUser, clearError, resetUserState } =
  userSlice.actions;
