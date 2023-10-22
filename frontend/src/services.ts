import axios from "axios";

const baseUrl = "http://localhost:8000"

export const signUp = async (userName: string, password: string)=> {
    return await axios.post(baseUrl + "/sign-up", {userName: userName, password: password})
}

export const signIn = async (userName: string, password: string) => {
    return await axios.post(baseUrl + "/sign-in", {username: userName, password: password}, {headers: {"content-type": "application/x-www-form-urlencoded"}})
}

interface FollowerPost {
    id: number,
    user_id: number,
    user_name: string,
    created_at: Date,
    content: string
}

export const fetchFollowersPosts = async (id: number | null = null, limit=8): Promise<FollowerPost[]> => {
    const token = localStorage.getItem("accessToken")
    let params: {limit: number, id?: number} = {limit: limit}
    params = id ? {...params, id: id} : params
    const response = await axios.get(baseUrl + "/followers/posts", {headers: {"Authorization": "Bearer " + token}, params: params})
    return response.data
}

interface UserPost {
    content: string
    id: number,
    user_id: number,
    created_at: Date,
}

export const fetchUserPosts = async (userName: string, id: number | null, limit = 8): Promise<UserPost[]> => {
    const token = localStorage.getItem("accessToken")
    let params: { limit: number, id?: number } = {limit: limit}
    params = id ? {...params, id: id} : params
    const response = await axios.get(baseUrl + `/user/${userName}/posts`, {
        headers: {"Authorization": "Bearer " + token},
        params: params
    })
    return response.data
}

export default {signUp, signIn, fetchFollowersPosts}