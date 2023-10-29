import {signIn} from "../services.ts";
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
      mutationFn: (data: FormValues) => signIn(data.userName, data.password),
      onSuccess: (data: AxiosResponse<{
        access_token: string
      }>) => {
        localStorage.setItem("accessToken", data.data.access_token);
        navigate("/feed")
      }
    }
  )

  return (
    <form className="flex flex-col justify-center items-center text-center h-screen space-y-4 text-xl"
          onSubmit={handleSubmit(data => {
            try {
              signInMutation.mutate(data)
              console.log("Successful sign in.")
            } catch (e) {
              console.log("Sign in failed with error: " + e)
            }
          })}>
      <div className="flex flex-col space-y-4">
        <label className="text-start" htmlFor="username">Username</label>
        <input className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
               id="username" {...register("userName")}/>
      </div>
      <div className="flex flex-col space-y-4">
        <label className="text-start" htmlFor="password">Password</label>
        <input className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5" id="password"
               type="password" {...register("password")}/>
      </div>
      <div className="border-2 border-black py-2 px-4 rounded-full hover:underline">
        <button type="submit">
          <span className="hover:underline">Sign in</span>
        </button>
      </div>
      {
        signInMutation.isError && axios.isAxiosError(signInMutation.error) ?
          <p className="text-red-600">{signInMutation.error.response?.data.detail}</p> : null
      }
    </form>
  )
}

export default SignUp