import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface signInState {
  userName: string
  password: string
  errorMessage: string | null
}

const initialSignInState: signInState = {
  userName: "",
  password: "",
  errorMessage: null
}

export const signInSlice = createSlice(
  {
    name: "signIn",
    initialState: initialSignInState,
    reducers: {
      setUserName: (state: signInState, action: PayloadAction<string>) => {
        state.userName = action.payload
      },
      setPassword: (state: signInState, action: PayloadAction<string>) => {
        state.password = action.payload
      },
      setErrorMessage: (state: signInState, action: PayloadAction<string>) => {
        state.errorMessage = action.payload
      }
    }
  }
)

export const {setUserName, setPassword, setErrorMessage} = signInSlice.actions