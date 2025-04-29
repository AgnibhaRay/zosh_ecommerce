import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/productTypes';
import { api } from '../../Config/Api';

const API_URL = '/products';

interface AdminProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  productCreated: boolean;
}

const initialState: AdminProductState = {
  products: [],
  loading: false,
  error: null,
  productCreated: false,
};

export const fetchAllProductsAdmin = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>('adminProduct/fetchAllProducts', async (jwt, { rejectWithValue }) => {
  try {
    const response = await api.get<Product[]>(`${API_URL}/admin/all`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch products');
  }
});

export const createProduct = createAsyncThunk<
  Product,
  { product: Partial<Product>; jwt: string },
  { rejectValue: string }
>('adminProduct/createProduct', async ({ product, jwt }, { rejectWithValue }) => {
  try {
    const response = await api.post<Product>(`${API_URL}/admin/create`, product, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to create product');
  }
});

export const deleteProduct = createAsyncThunk<
  number,
  { id: number; jwt: string },
  { rejectValue: string }
>('adminProduct/deleteProduct', async ({ id, jwt }, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/admin/delete/${id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to delete product');
  }
});

const adminProductSlice = createSlice({
  name: 'adminProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productCreated = false;
      })
      .addCase(fetchAllProductsAdmin.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProductsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productCreated = false;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
        state.loading = false;
        state.productCreated = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create product';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product';
      });
  },
});

export default adminProductSlice.reducer;