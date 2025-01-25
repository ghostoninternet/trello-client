import { configureStore } from '@reduxjs/toolkit'
import activeBoardReducer from './activeBoard/activeBoardSlice.js'

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer
  }
})