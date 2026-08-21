import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderNumber: '',
  truckIDs: [],
  customer: '',
  totalWeight: '',
  totalQuantity: '',
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderNumber(state, action) {
      state.orderNumber = action.payload
    },
    setTruckIDs(state, action) {
      state.truckIDs = action.payload
    },
    addTruckID(state, action) {
      state.truckIDs.push(action.payload)
    },
    setCustomer(state, action) {
      state.customer = action.payload
    },
    setTotalWeight(state, action) {
      state.totalWeight = action.payload
    },
    setTotalQuantity(state, action) {
      state.totalQuantity = action.payload
    }
  }
})

export const {
  setCustomer,
  setOrderNumber,
  setTotalQuantity,
  setTotalWeight,
  setTruckIDs,
  addTruckID
} = orderSlice.actions

export default orderSlice.reducer;

export const getOrderNumber = (state) => state.orderNumber;

export const getTrucksOnOrder = (state) => state.truckIDs

export const getCustomer = (state) => state.customer

export const getTotalWeight = (state) => state.totalWeight

export const getTotalQuantity = (state) => state.totalQuantity