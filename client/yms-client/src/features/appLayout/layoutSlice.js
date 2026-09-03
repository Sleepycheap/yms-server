import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  screen: '',
  online: true,
  loading: false,
}

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setScreen(state, action) {
      state.screen = action.payload
    },
    setOnline(state, action) {
      state.online = action.payload
    },
    setLoading(state, action) {
      state.online = action.payload
    }
  }
})

export const {
  setScreen,
  setOnline,
  setLoading
} = layoutSlice.actions

export default layoutSlice.reducer;