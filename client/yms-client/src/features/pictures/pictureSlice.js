import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scannedTruck: null,
  scannedQRCode: '',
  pictureTest: ''
}

const pictureSlice = createSlice({
  name: 'picture',
  initialState,
  reducers: {
    setScannedTruck(state, action) {
      state.scannedTruck = action.payload
    },
    setScannedQRCode(state, action) {
      state.scannedTruck = action.payload
    },
    setPictureTest(state, action) {
      state.pictureTest = action.payload
    }
  }
})

export const {setScannedTruck, setScannedQRCode, setPictureTest} = pictureSlice.actions;

export default pictureSlice.reducer;

export const getScannedTruck = (state) => state.scannedTruck;

export const getScannedQRCode = (state) => state.scannedQRCode;
