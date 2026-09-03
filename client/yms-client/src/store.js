import {configureStore} from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import orgReducer from './features/organization/orgSlice'
import truckReducer from './features/truck/truckSlice'
import orderReducer from './features/order/orderSlice'
import pictureReducer from './features/pictures/pictureSlice'
import canvasReducer from './features/refs/canvasSlice'
import layoutReducer from './features/appLayout/layoutSlice'
import loadReducer from './features/load/loadSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    org: orgReducer,
    truck: truckReducer,
    order: orderReducer,
    picture: pictureReducer,
    canvas: canvasReducer,
    layout: layoutReducer,
    load: loadReducer
  }
})

export default store;