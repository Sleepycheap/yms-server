import {createSlice } from '@reduxjs/toolkit'

const initialState = {
  org: [],
   
  // org: [
  //   {
  //     selectedCode: 'Ann'
  //     codes: [
//     "ANN",
//     "VIS",
//     "JAC",
//     "MTY",
//     "STJ",
//     "RAI",
//     "EVA"
// ]
  //   }
  // ]
};

const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload)
    },
    deleteItem(state, action) {
      
    }
  }
})

export const {
  setSelectedCode
} = orgSlice.actions;

export default orgSlice.reducer;

export const getOrgCode = (state) => state.org.org;
