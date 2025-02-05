import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatter'
import { mapOrder } from '~/utils/sorts'

// Init initial state value of a slice in redux
const initialState = {
  currentActiveBoard: null
}

// With asynchronous actions (call API, call third party,...) we will
// use middleware createAsyncThunk together with extraReducers in Redux
// Ref: https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    // Note: axios will return its result in its 'data' property
    return response.data
  }
)

// Init a slice in Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Handle synchronous logic
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // Always write function body enclosed in {} or else Redux will throw error
      // Ref: https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state

      // action.payload is a standard way for naming input data to reducer of Redux
      // Here we assign the value of it to a more meaningful name
      const board = action.payload

      // Process data if necessary

      // Update data of currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      const incomingCard = action.payload

      const column = state.currentActiveBoard.columns.find(i => i._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  // ExtraReducers: Handle asynchornous logic
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload is the response.data that we return from API function
      const board = action.payload

      // Board members will be combined by members and owners array
      board.FE_allUsers = board.owners.concat(board.members)

      // Process data if necessary
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach(column => {
        // Handle case: When F5, we need to handle drag and drop to empty column
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // Update data of currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
// Actions: Place for components call inside dispatch()
// to update state using reducer (synchronous).
// These actions are automatically created by Redux by using reducers names
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

// Selectors: Place for components call using useSelector()
// to get data from Redux Store
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// This file name activeBoardSlice BUT we will export something called reducer
export default activeBoardSlice.reducer