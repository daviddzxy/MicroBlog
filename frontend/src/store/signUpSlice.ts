import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface signUpState {
  userName: string
  password: string
  errorMessage: string | null
}

const initialSignUpState: signUpState = {
  userName: "",
  password: "",
  errorMessage: null
}

export const signUpSlice = createSlice(
  {
    name: "signUp",
    initialState: initialSignUpState,
    reducers: {
      setUserName: (state: signUpState, action: PayloadAction<string>) => {
        state.userName = action.payload
      },
      setPassword: (state: signUpState, action: PayloadAction<string>) => {
        state.password = action.payload
      },
      setErrorMessage: (state: signUpState, action: PayloadAction<string>) => {
        state.errorMessage = action.payload
      }
    }
  }
)

export const {setUserName, setPassword, setErrorMessage} = signUpSlice.actions