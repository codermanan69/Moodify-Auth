import axios from 'axios'

const api = axios.create({
    baseURL: window.location.hostname === "localhost" ? "http://localhost:3000" : window.location.origin,
    withCredentials : true
})

export async function getSong({mood}){
    const response = await api.get("/api/songs?mood="+mood)

    return response.data
}