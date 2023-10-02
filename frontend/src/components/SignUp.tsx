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
    <form className="flex flex-col justify-center items-center text-center h-screen space-y-4 text-xl"
          onSubmit={handleSubmit(data => {
            try {
              signUpMutation.mutate(data)
              console.log("Successful sign up.")
            } catch (e) {
              console.log("Sign up failed with error: " + e)
            }
          })
          }>
      <div className="flex flex-col space-y-4">
        <label className="text-start" htmlFor="username">Username</label>
        <input id="username" className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5" {...register("userName")}/>
      </div>
      <div className="flex flex-col space-y-4">
        <label className="text-start" htmlFor="password">Password</label>
        <input className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5" id="password" type="password" {...register("password")}/></div>
      <div>
        <button className="border-2 border-black py-2 px-4 rounded-full hover:underline" type="submit">
          <span className="hover:underline">Sign up</span>
        </button>
      </div>
      {signUpMutation.isError && axios.isAxiosError(signUpMutation.error) ? <p className="text-red-600">{signUpMutation.error.response?.data.detail}</p> : null}
    </form>
  )
}

export default SignUp