import services from "../services.ts";
import {AxiosResponse} from "axios";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

type FormValues = {
  userName: string;
  password: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm<FormValues>();
  const signInMutation = useMutation({
      mutationFn: (data: FormValues) => services.signIn(data.userName, data.password),
      onSuccess: (data: AxiosResponse<{ access_token: string }>) => {
        localStorage.setItem("accessToken", data.data.access_token);
        navigate("/feed")
      }
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
      {signInMutation.isError && axios.isAxiosError(signInMutation.error) ? <p>{signInMutation.error.response?.data.detail}</p> : null}
    </div>
  )
}

export default SignUp