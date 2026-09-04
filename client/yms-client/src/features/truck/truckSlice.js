import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  truckIDs: [],
  selectedTruck: '',
  selectedOrg: '',
  trailerNumber: '',
  generatedTruck: '',
  truckWeight: '',
  truckQty: ''
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
    setTrailerNumber(state, action) {
      state.trailerNumber = action.payload;
    },
    setGeneratedTruck(state, action) {
      state.generatedTruck = action.payload
    },
    setTruckWeight(state, action) {
      state.truckWeight = action.payload
    },
    setTruckQty(state, action) {
      state.truckQty = action.payload
    }
  },
})

export const {
  setSelectedTruck,
  setTruckIDs,
  setOrg,
  setTrailerNumber,
  addTruckID,
  setGeneratedTruck,
  setTruckWeight,
  setTruckQty
} = truckSlice.actions;

export default truckSlice.reducer;

export const getSelectedTruck = (state) => state.selectedTruck;

export const getTruckIDs = (state) => state.truckIDs;

export const getOrg = (state) => state.selectedOrg;

