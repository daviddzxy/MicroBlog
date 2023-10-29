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
    userId: number,
    userName: string,
    createdAt: Date,
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
    userId: number,
    createdAt: Date,
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

interface User {
    userName: string
    id: number,
    createdAt: Date,
}

export const fetchUser = async (userName: string): Promise<User> => {
    const token = localStorage.getItem("accessToken")
    const response = await axios.get(baseUrl + `/user/${userName}`, {
        headers: {"Authorization": "Bearer " + token}
    })
    return response.data
}


export const followUser = async (userName: string) => {
    const token = localStorage.getItem("accessToken")
    return await axios.post(baseUrl + `/follow/${userName}`, null,
      {headers: {"Authorization": "Bearer " + token}}
    )
}
