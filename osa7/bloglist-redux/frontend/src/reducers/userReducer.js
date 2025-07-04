import { createSlice } from '@reduxjs/toolkit'

// Get user from localStorage to prevent null issues
const getUserFromStorage = () => {
  try {
    const loggedUserJSON = window.localStorage.getItem('blogUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  } catch (error) {
    console.error('Error parsing user from localStorage:', error)
    return null
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState: getUserFromStorage(),
  reducers: {
    setUser: (state, action) => {
      return action.payload
    },
    clearUser: (state) => {
      window.localStorage.removeItem('blogUser')
      return null
    },
  },
})

export default userSlice.reducer
export const { setUser, clearUser } = userSlice.actions
