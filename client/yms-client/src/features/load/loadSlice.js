import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  containers: []
}

const loadSlice = createSlice({
  name: 'load',
  initialState,
  reducers: {
    setContainers(state, action) {
      state.containers = action.payload
    }
  }
})

export const {
  setContainers
} = loadSlice.actions;

export default loadSlice.reducer