import {setUserName, setPassword, setErrorMessage} from "../store/signInSlice.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import React from "react";
import services from "../services.ts";
import axios, {AxiosResponse} from "axios";

const SignUp = () => {
  const userName = useAppSelector(state => state.signIn.userName)
  const password = useAppSelector(state => state.signIn.password)
  const errorMessage = useAppSelector(state => state.signIn.errorMessage)

  const submitSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response: AxiosResponse<{access_token: string}> = await services.signIn(userName, password)
      localStorage.setItem("access_token", response.data.access_token)
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
      <form onSubmit={submitSignIn}>
        <label htmlFor="input">Username</label>
        <input id="input" onChange={(event) => dispatch(setUserName(event.target.value))} value={userName}/>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" onChange={(event) => dispatch(setPassword(event.target.value))} value={password}/>
        <button type="submit">Sign In</button>
        {errorMessage !== null && <p>{errorMessage}</p> }
      </form>
    </div>
  )
}

export default SignUp