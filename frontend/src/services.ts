import axios from "axios";

const baseUrl = "http://localhost:8000"
const signUpUrl = "/sign-up"
const signInUrl = "/sign-in"
const followersPostsUrl = "/followers/posts"

export const signUp = async (userName: string, password: string)=> {
    return await axios.post(baseUrl + signUpUrl, {userName: userName, password: password})
}

export const signIn = async (userName: string, password: string) => {
    return await axios.post(baseUrl + signInUrl, {username: userName, password: password}, {headers: {"content-type": "application/x-www-form-urlencoded"}})
}

interface FollowerPost {
    id: number,
    user_id: number,
    user_name: string,
    created_at: Date,
    content: string
}

export const fetchFollowersPosts = async (): Promise<FollowerPost[]> => {
    const token = localStorage.getItem("accessToken")
    const response = await axios.get(baseUrl + followersPostsUrl, {headers: {"Authorization": "Bearer " + token}})
    return response.data
}

export default {signUp, signIn, fetchFollowersPosts}