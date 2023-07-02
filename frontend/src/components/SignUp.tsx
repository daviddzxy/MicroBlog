import {setUserName, setPassword, setErrorMessage} from "../store/signUpSlice.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import services from "../services.ts";
import React from "react";
import axios from "axios";

const SignUp = () => {
  const userName = useAppSelector(state => state.signUp.userName)
  const password = useAppSelector(state => state.signUp.password)
  const errorMessage = useAppSelector(state => state.signUp.errorMessage)

  const submitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await services.signUp(userName, password)
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log(e)
        if (e.response?.data.detail) {dispatch(setErrorMessage(e.response.data.detail))}
      }
    }
  }

  const dispatch = useAppDispatch()
  return (
    <div>
      <form onSubmit={submitSignUp}>
        <label htmlFor="input">Username</label>
        <input id="input" onChange={(event) => dispatch(setUserName(event.target.value))} value={userName}/>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" onChange={(event) => dispatch(setPassword(event.target.value))} value={password}/>
        <button type="submit">Sign Up</button>
        {errorMessage !== null && <p>{errorMessage}</p> }
        <p></p>
      </form>
    </div>
  )
}

export default SignUp