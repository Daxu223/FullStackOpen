import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    message: '',
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      // Okay, this is quite weird.
      // createSlice uses Immer internally, which lets you write
      // immutable update logic using "mutating syntax"
      // Immer uses 'draft states' and produces a new state.
      // This enables the following:
      state.message = action.payload
    },
    hideNotification: (state) => {
      state.message = ''
    }, 
  },
})

export default notificationSlice.reducer
export const { showNotification, hideNotification } = notificationSlice.actions