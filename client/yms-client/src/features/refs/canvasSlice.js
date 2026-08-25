import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  canvasElement: null
}

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvasElement(state, action) {
      state.canvasElement = action.payload
    }
  }
})

export const {setCanvasElement} = canvasSlice.actions

export default canvasSlice.reducer

export const getCanasElement = (state) => state.canvasElement;
