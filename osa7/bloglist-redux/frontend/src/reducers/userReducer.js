import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (state, action) => {
      return action.payload
    },
    clearUser: (state) => {
      window.localStorage.removeItem('blogUser')
      return null
    }
  }
})

export default userSlice.reducer
export const { setUser, clearUser } = userSlice.actions