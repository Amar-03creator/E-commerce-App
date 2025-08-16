import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../../api/axiosConfig';

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (data) => {
    const response = await apiClient.post('/api/shop/review/add', data);
    return response.data;
  }
);

export const getReviews = createAsyncThunk(
  "/order/getReviews", 
  async (productId) => {
    const response = await apiClient.get(`/api/shop/review/${productId}`);
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
