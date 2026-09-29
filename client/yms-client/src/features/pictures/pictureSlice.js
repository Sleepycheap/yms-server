import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scannedTruck: null,
  scannedQRCode: '',
  scanBarCode: false,
  scannedContainer: '',
  scannedObject: null,
  uploadedImages: [],
  photoCount: 0
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
    setScanBarCode(state, action) {
      state.pictureTest = action.payload
    },
    setScannedContainer(state, action) {
      state.scannedContainer = action.payload
    },
    setScannedObject(state, action) {
      state.scannedObject = action.payload
    },
    setUploadedImages(state, action) {
      state.uploadedImages = [...state.uploadedImages, action.payload]
    },
    setPhotoCount(state, action) {
      state.photoCount = state.photoCount + action.payload
    }
  }
})

export const {setScannedTruck, setScannedQRCode, setScanBarCode, setScannedContainer, setScannedObject, setUploadedImages, setPhotoCount} = pictureSlice.actions;

export default pictureSlice.reducer;

export const getScannedTruck = (state) => state.scannedTruck;

export const getScannedQRCode = (state) => state.scannedQRCode;
