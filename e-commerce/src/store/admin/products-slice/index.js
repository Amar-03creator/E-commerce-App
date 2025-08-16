import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../../api/axiosConfig';

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  '/products/addnewproduct',
  async (formData) => {
    const result = await apiClient.post('/api/admin/products/add', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  '/products/fetchAllProducts',
  async () => {
    const result = await apiClient.get('/api/admin/products/get');
    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  '/products/editProduct',
  async ({ id, formData }) => {
    const result = await apiClient.put(`/api/admin/products/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  '/products/deleteProduct',
  async (id) => {
    // Note: Corrected typo from .deletee to .delete
    const result = await apiClient.delete(`/api/admin/products/delete/${id}`);
    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        console.log(action.payload, "action.payload");
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        console.log(action.payload, "action.payload");
        state.isLoading = false;
        state.productList = [];
      })
  },
});
export default AdminProductsSlice.reducer;
