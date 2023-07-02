import axios from "axios";

const url = "http://localhost:8000/operations/sign-up"
export const signUp = async (userName: string, password: string)=> {
    await axios.post(url, {userName: userName, password: password})
}

export default {signUp}