import services from "../services.ts";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";
import axios from "axios";

type FormValues = {
  userName: string;
  password: string;
}

const SignUp = () => {
  const {register, handleSubmit} = useForm<FormValues>();
  const signUpMutation = useMutation({
      mutationFn: (data: FormValues) => services.signUp(data.userName, data.password)
    }
  )

  return (
    <div>
      <form onSubmit={handleSubmit(data => {
        try {
          signUpMutation.mutate(data)
          console.log("Successful sign up.")
        } catch (e) {
          console.log("Sign up failed with error: " + e)
        }})
      }>
        <label htmlFor="input">Username</label>
        <input id="input" {...register("userName")}/>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")}/>
        <button type="submit">Sign Up</button>
      </form>
      {signUpMutation.isError && axios.isAxiosError(signUpMutation.error) ? <p>{signUpMutation.error.response?.data.detail}</p> : null}
    </div>
  )
}

export default SignUp