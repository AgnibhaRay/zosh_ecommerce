import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/userTypes';
import { api } from '../../Config/Api';

const API_URL = '/api/users';

interface AdminCustomerState {
  customers: User[];
  loading: boolean;
  error: string | null;
  customerCreated: boolean;
}

const initialState: AdminCustomerState = {
  customers: [],
  loading: false,
  error: null,
  customerCreated: false,
};

export const fetchAllCustomers = createAsyncThunk<
  User[],
  string,
  { rejectValue: string }
>('adminCustomer/fetchAllCustomers', async (jwt, { rejectWithValue }) => {
  try {
    const response = await api.get<User[]>(`${API_URL}/admin/all`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch customers');
  }
});

export const createCustomer = createAsyncThunk<
  User,
  { customer: Partial<User>; jwt: string },
  { rejectValue: string }
>('adminCustomer/createCustomer', async ({ customer, jwt }, { rejectWithValue }) => {
  try {
    const response = await api.post<User>(`${API_URL}/admin/create`, customer, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to create customer');
  }
});

export const deleteCustomer = createAsyncThunk<
  number,
  { id: number; jwt: string },
  { rejectValue: string }
>('adminCustomer/deleteCustomer', async ({ id, jwt }, { rejectWithValue }) => {
  try {
    console.log('Attempting to delete customer with ID:', id);
    await api.delete(`${API_URL}/admin/delete/${id}`, {
      headers: { 
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
    });
    console.log('Successfully deleted customer with ID:', id);
    return id;
  } catch (error: any) {
    console.error('Error deleting customer:', error.response?.data);
    return rejectWithValue(error.response?.data || 'Failed to delete customer');
  }
});

const adminCustomerSlice = createSlice({
  name: 'adminCustomer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.customerCreated = false;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.customers = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch customers';
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.customerCreated = false;
      })
      .addCase(createCustomer.fulfilled, (state, action: PayloadAction<User>) => {
        state.customers.push(action.payload);
        state.loading = false;
        state.customerCreated = true;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create customer';
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<number>) => {
        state.customers = state.customers.filter((c) => c.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete customer';
      });
  },
});

export default adminCustomerSlice.reducer;