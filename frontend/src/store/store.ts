import { configureStore } from '@reduxjs/toolkit'
import {signUpSlice} from "./signUpSlice.ts";
import {signInSlice} from "./signInSlice.ts";

export const store = configureStore({
  reducer: {
    signUp: signUpSlice.reducer,
    signIn: signInSlice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch