import {createSlice} from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { determineClosestPlant } from '../../utils/geoLocation'
import {getContext} from '@microsoft/power-apps/app'

function getPosition() {
  return new Promise(function (resolve, reject) {
  navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export const getUserDetails = createAsyncThunk(
  async function () {
    // 1 we get the user's geolocation position
    const positionObj = await getPosition();
    const center = {
      lat: positionObj.coords.latitude,
      lon: positionObj.coords.longitude
    };

    // 2 then we determine which plant is closet
    const orgCode = await determineClosestPlant(center)

    // 3 then we get user's info from Teams

    const ctx = await getContext(); // ctx is context to get info from Teams
    const {userPrincipalName} = ctx.user;

    const username = userPrincipalName.split('@')[0].split('.').join(' ');

    return {orgCode, username}
  }
)

/* my coords: {
  lat: 38.965371496033804,
  lon: -94.91863231563847
}
  */ 

const initialState = {
  username: '',
  orgCode: '',
  status: 'idle',
  admin: false,
  error: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload
    },
    updateOrgCode(state, action) {
      state.orgCode = action.payload
    }
  },
  extraReducers: (builder) => 
    builder
     .addCase(getUserDetails.pending, (state, action) => {
      state.status = 'loading';
     })
    .addCase(getUserDetails.fulfilled, (state, action) => {
      state.orgCode = action.payload.orgCode;
      state.username = action.payload.username;
      state.status = 'idle'
    })
    .addCase(getUserDetails.rejected, (state, action) => {
      state.status = 'error';
      state.error = 'There was an error getting user details'
    })
})

export const {updateName, updateOrgCode} = userSlice.actions

export default userSlice.reducer;

export const getOrgCode = (state) => state.orgCode;

export const getUserName = (state) => state.username;