import services from "../services.ts";
import {AxiosResponse} from "axios";
import {useForm} from "react-hook-form";

type FormValues = {
  userName: string;
  password: string;
}

const SignUp = () => {
    const { register, handleSubmit } = useForm<FormValues>();

  const submitSignIn = async (data: FormValues) => {
      const response: AxiosResponse<{access_token: string}> = await services.signIn(data.userName, data.password)
      localStorage.setItem("access_token", response.data.access_token)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submitSignIn)}>
        <label htmlFor="input">Username</label>
        <input id="input" {...register("userName")}/>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")}/>
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

export default SignUp