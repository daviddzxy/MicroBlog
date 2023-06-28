import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface signUpState {
  userName: string
  password: string
}

const initialSignUpState: signUpState = {
  userName: "",
  password: ""
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
      }
    }
  }
)

export const {setUserName, setPassword} = signUpSlice.actions