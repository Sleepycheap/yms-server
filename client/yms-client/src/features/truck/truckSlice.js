import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  truckIDs: [],
  selectedTruck: '',
  selectedOrg: ''
}

const truckSlice = createSlice({
  name: 'truck',
  initialState,
  reducers: {
    setSelectedTruck(state, action) {
      state.selectedTruck = action.payload
    },
    setTruckIDs(state, action) {
      state.truckIDs = action.payload
    },
    addTruckID(state, action) {
      state.truckIDs.push(action.payload)
    },
    setOrg(state, action) {
      state.selectedOrg = action.payload
    },
  },
})

export const {
  setSelectedTruck,
  setTruckIDs,
  setOrg
} = truckSlice.actions;

export default truckSlice.reducer;

export const getSelectedTruck = (state) => state.selectedTruck;

export const getTruckIDs = (state) => state.truckIDs;

export const getOrg = (state) => state.selectedOrg;

function takePicture() {
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  } else {
    clearPhoto();
  }
}

