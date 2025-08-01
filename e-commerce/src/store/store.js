// const { configureStore } = require("@reduxjs/toolkit");
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice'
import adminProductsSlice from './admin/products-slice/index.js';
import shoppingProductSlice from './shop/products-slice/index.js';
import adminOrderSlice from "./admin/order-slice"

import shoppingCartSlice from './shop/cart-slice/index.js';
import addressSlice from './shop/address-slice/index.js';
import shopOrderSlice from "./shop/order-slice"
import shopSearchSlice from "./shop/search-slice/index.js";
import shopReviewSlice from "./shop/review-slice/index.js"
import commonFeatureSlice from "./common-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    shoppingProduct: shoppingProductSlice,
    shoppingCart: shoppingCartSlice,
    shoppingAddress: addressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    commonFeature: commonFeatureSlice,
  },
});

export default store;