import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scannedTruck: null
}

const pictureSlice = createSlice({
  name: 'picture',
  initialState,
  reducers: {
    setScannedTruck(state, action) {
      state.scannedTruck = action.payload
    }
  }
})

export const {setScannedTruck} = pictureSlice.actions;

export default pictureSlice.reducer;

export const getScannedTruck = (state) => state.scannedTruck;