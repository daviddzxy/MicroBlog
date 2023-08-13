import services from "../services.ts";
import {AxiosResponse} from "axios";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";
import axios from "axios";

type FormValues = {
  userName: string;
  password: string;
}

const SignUp = () => {
  const {register, handleSubmit} = useForm<FormValues>();
  const signInMutation = useMutation({
      mutationFn: (data: FormValues) => services.signIn(data.userName, data.password),
      onSuccess: (data: AxiosResponse<{ access_token: string }>) => localStorage.setItem("access_token", data.data.access_token)
    }
  )

  return (
    <div>
      <form onSubmit={handleSubmit(data => {
        try {
          signInMutation.mutate(data)
          console.log("Successful sign in.")
        } catch (e) {
          console.log("Sign in failed with error: " + e)
        }
      })}>
        <label htmlFor="input">Username</label>
        <input id="input" {...register("userName")}/>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")}/>
        <button type="submit">Sign In</button>
      </form>
      {signInMutation.isError && axios.isAxiosError(signInMutation.error) ? <div>{signInMutation.error.response?.data.detail}</div> : null}
    </div>
  )
}

export default SignUp