import services from "../services.ts";
import {useForm} from "react-hook-form";

type FormValues = {
  userName: string;
  password: string;
}
const SignUp = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  const submitSignUp = async (data: FormValues) => {
    await services.signUp(data.userName, data.password)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submitSignUp)}>
        <label htmlFor="input">Username</label>
        <input id="input" {...register("userName")}/>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")}/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp