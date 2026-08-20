import {configureStore} from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import orgReducer from './features/organization/orgSlice'
import truckReducer from './features/truck/truckSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    org: orgReducer,
    truck: truckReducer
  }
})

export default store;