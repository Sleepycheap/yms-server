import {configureStore} from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import orgReducer from './features/organization/orgSlice'
import truckReducer from './features/truck/truckSlice'
import orderReducer from './features/order/orderSlice'
import pictureReducer from './features/pictures/pictureSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    org: orgReducer,
    truck: truckReducer,
    order: orderReducer,
    picture: pictureReducer
  }
})

export default store;