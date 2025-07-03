import { createSlice } from '@reduxjs/toolkit'

const initialState = { type: '', message: '' }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.type = action.payload.type
      state.message = action.payload.message
    },
    hideNotification: (state, action) => {
      state.type = ''
      state.message = ''
    },
  },
})

export const { setNotification, hideNotification } = notificationSlice.actions

let timeoutId = null

export const showNotification = (message, type, durationMs) => {
  return async dispatch => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    dispatch(setNotification({ message: message, type: type }))

    timeoutId = setTimeout(() => {
      dispatch(hideNotification())
    }, durationMs)
  }
}

export default notificationSlice.reducer
