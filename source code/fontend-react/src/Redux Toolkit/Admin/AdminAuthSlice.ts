import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../Config/Api';
import { AuthResponse } from '../../types/authTypes';

interface AdminAuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
}

const initialState: AdminAuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  otpSent: false
};

export const sendAdminLoginOtp = createAsyncThunk(
  'adminAuth/sendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      await api.post('/auth/admin/send-otp', { email });
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyAdminLogin = createAsyncThunk(
  'adminAuth/verify',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/admin/verify', { email, otp });
      localStorage.setItem('adminToken', response.data.jwt);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Invalid credentials');
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    resetState: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.otpSent = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem('adminToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAdminLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendAdminLoginOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendAdminLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyAdminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAdminLogin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(verifyAdminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetState, logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;