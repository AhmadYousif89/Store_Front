import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "/api/products";

// Show products
const getProducts = createAsyncThunk("products/getAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (err) {
    const message =
      ((err as any).response &&
        (err as any).response.data &&
        (err as any).response.data.message) ||
      (err as any).message ||
      (err as any).toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  products: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.products = [];
        state.message = action.payload as string;
      });
  },
});

const { reset } = productSlice.actions;

export { reset, getProducts };
export default productSlice.reducer;
