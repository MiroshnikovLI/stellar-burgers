import {
  getOrdersApi,
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
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response;
    } catch (error) {
      return rejectWithValue('Указан неверный email или пароль');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      deleteCookie('accessToken');
      localStorage.clear();
      return response;
    } catch (error) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response;
    } catch (error) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
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
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(data);
    } catch (error) {
      return rejectWithValue('Ошибка обновления данных');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'feed/fetchUserOrders',
  async () => getOrdersApi()
);

export const initialState: UserState = {
  user: null,
  error: '',
  isAuthChecked: false,
  success: false,
  isLoading: false,
  errorBanner: false,
  userOrders: []
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
    }
  },
  selectors: {
    selectUserOrders: (state) => state.userOrders,
    selectUser: (state) => state.user,
    selectAuthChecked: (state) => state.isAuthChecked,
    selectAuthError: (state) => state.error,
    selectAuthLoading: (state) => state.isLoading,
    selectErrorBanner: (state) => state.errorBanner
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
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.error = '';
        state.isLoading = false;
        state.errorBanner = false;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorBanner = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.success = false;
        state.user = null;
        state.errorBanner = false;
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
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorBanner = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.errorBanner = false;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
        state.errorBanner = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      });
  }
});

export const {
  selectUserOrders,
  selectUser,
  selectAuthChecked,
  selectAuthError,
  selectAuthLoading,
  selectErrorBanner
} = userSlice.selectors;

export const { setAuthChecked, setUser, clearError } = userSlice.actions;
