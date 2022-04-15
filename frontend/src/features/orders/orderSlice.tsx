import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import orderService from "./orderServices";

let token;
// Create a order
const createOrder = createAsyncThunk(
  "orders/create",
  async (order: object, thunkAPI: RootStateOrAny) => {
    try {
      token = thunkAPI.getState().auth.user.jwt.token;
      return await orderService.createOrder(order, token);
    } catch (err) {
      const message =
        ((err as any).response &&
          (err as any).response.data &&
          (err as any).response.data.message) ||
        (err as any).message ||
        (err as any).toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get all orders
const getOrders = createAsyncThunk(
  "orders/getAll",
  async (_, thunkAPI: RootStateOrAny) => {
    try {
      token = thunkAPI.getState().auth.user.jwt.token;
      return await orderService.getOrders(token);
    } catch (err) {
      const message =
        ((err as any).response &&
          (err as any).response.data &&
          (err as any).response.data.message) ||
        (err as any).message ||
        (err as any).toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Update order
const updateOrder = createAsyncThunk(
  "orders/update",
  async (orderId: number, thunkAPI: RootStateOrAny) => {
    try {
      token = thunkAPI.getState().auth.user.jwt.token;
      return await orderService.updateOrder(orderId, token);
    } catch (err) {
      const message =
        ((err as any).response &&
          (err as any).response.data &&
          (err as any).response.data.message) ||
        (err as any).message ||
        (err as any).toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Delete order
const delOrder = createAsyncThunk(
  "orders/delete",
  async (orderId: number, thunkAPI: RootStateOrAny) => {
    try {
      token = thunkAPI.getState().auth.user.jwt.token;
      return await orderService.delOrder(orderId, token);
    } catch (err) {
      const message =
        ((err as any).response &&
          (err as any).response.data &&
          (err as any).response.data.message) ||
        (err as any).message ||
        (err as any).toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  orders: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
        state.message = action.payload as string;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
    // .addCase(createOrder.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(createOrder.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   (state.orders as any[]).push(action.payload);
    //   state.message = action.payload.message as string;
    // })
    // .addCase(createOrder.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload as string;
    // })
    // .addCase(updateOrder.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(updateOrder.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.orders = action.payload;
    //   state.message = action.payload.message as string;
    // })
    // .addCase(updateOrder.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload as string;
    // })
    // .addCase(delOrder.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(delOrder.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.message = action.payload.message as string;
    // })
    // .addCase(delOrder.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload as string;
    // });
  },
});

const { reset } = orderSlice.actions;

export { reset, getOrders, createOrder, updateOrder, delOrder };
export default orderSlice.reducer;
