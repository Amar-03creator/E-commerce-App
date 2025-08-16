import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../../api/axiosConfig';

const initialState = {
  isLoading: false,
  addressList:[],
}

export const addNewAddress = createAsyncThunk(
  'address/addNewAddress', async(formData) => {
    const response = await apiClient.post('http://localhost:5000/api/shop/address/add', formData);
    return response.data;
  }
);
  
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses', async(userId) => {
    const response = await apiClient.get(`http://localhost:5000/api/shop/address/get/${userId}`);
    return response.data;
  }
);

export const editAddress = createAsyncThunk(
  'address/editAddress', async({userId, addressId, formData}) => {
    const response = await apiClient.put(`http://localhost:5000/api/shop/address/edit/${userId}/${addressId}`, formData);
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress', async({userId, addressId}) => {
    const response = await apiClient.deletee(`http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`);
    return response.data;
  }
);

// This is the address slice for managing addresses in the Redux store
// It includes actions for adding, fetching, editing, and deleting addresses

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.addressList = action.payload.data ? action.payload.data : [];
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
        // state.addressList = [];
      })
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAddresses.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedAddr = action.payload.data; 
        const idx = state.addressList.findIndex(
          (addr) => addr._id === updatedAddr._id
        );
        if (idx !== -1) {
          state.addressList[idx] = updatedAddr;
        }
      })
      .addCase(editAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const { addressId } = action.payload;
        state.addressList = state.addressList.filter((address) => address._id !== addressId);
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default addressSlice.reducer;
