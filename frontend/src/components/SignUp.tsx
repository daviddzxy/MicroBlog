import {setUserName, setPassword} from "../store/signUpSlice.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";

const SignUp = () => {
  const userName = useAppSelector(state => state.signUp.userName)
  const password = useAppSelector(state => state.signUp.password)
  const dispatch = useAppDispatch()
  return (
    <div>
      <label htmlFor="input">Username</label>
      <input id="input" onChange={(event) => dispatch(setUserName(event.target.value))} value={userName}/>
      <label htmlFor="password">Password</label>
      <input id="password" onChange={(event) => dispatch(setPassword(event.target.value))} value={password}/>
      <button/>
    </div>
  )
}

export default SignUp