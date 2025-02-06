import { configureStore } from '@reduxjs/toolkit'
import activeBoardReducer from './activeBoard/activeBoardSlice.js'
import userReducer from './user/userSlice.js'
import { activeCardReducer } from './activeCard/activeCardSlice.js'
import { notificationReducer } from './notifications/notificationsSlice.js'

// Config redux-persist
// https://www.npmjs.com/package/redux-persist
// Tutorial blog:
// https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
import storage from 'redux-persist/lib/storage' // default as local storage
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'

const rootPersistConfig = {
  key: 'root', // Specify key of persist, default as root
  storage: storage, // Specify where to save data, default as local storage
  whitelist: ['user'] // Define list of SLICE that will be persisted each time browser refresh
  // blacklist: ['user'] // Define list of SLICE that will not be presisted each time browser refresh
}

// Combine our reducers
const reducers = combineReducers({
  activeCard: activeCardReducer,
  activeBoard: activeBoardReducer,
  user: userReducer,
  notifications: notificationReducer
})

// Persist reducer
const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  // Fix warning when setting up redux-persist
  // https://stackoverflow.com/a/63244831/8324172
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})