import apiClient from '../../../api/axiosConfig';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state for the shopping product slice
const initialState = {
  productList: [],
  isLoading: false,
  productDetails: null

};


export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async({filterParams,sortParams}) => {
    const query= new URLSearchParams({
      ...filterParams,
      sortBy: sortParams
    });
    const result = await apiClient.get(`http://localhost:5000/api/shop/products/get?${query}`
    );
    
    return result?.data;
  }
)

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await apiClient.get(`http://localhost:5000/api/shop/products/get/${id}`);
    return result?.data;
  }
)


const shoppingProductSlice = createSlice({
  name: 'shoppingProduct',
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        
        state.productList = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
        state.error = "Something went wrong";
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.productDetails = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
        state.error = "Something went wrong";
      });
  }
})
export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;