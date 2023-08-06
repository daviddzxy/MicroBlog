import axios from "axios";

const baseUrl = "http://localhost:8000"
const signUpUrl = "/operations/sign-up"
const signInUrl = "/operations/sign-in"

export const signUp = async (userName: string, password: string)=> {
    await axios.post(baseUrl + signUpUrl, {userName: userName, password: password})
}

export const signIn = async (userName: string, password: string) => {
    return axios.post(baseUrl + signInUrl, {username: userName, password: password}, {headers: {"content-type": "application/x-www-form-urlencoded"}})
}

export default {signUp, signIn}