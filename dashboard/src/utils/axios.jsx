import axios from "axios"
// export const API_DOMAIN = "https://tariqul.pythonanywhere.com"
export const API_DOMAIN = "http://127.0.0.1:8000"
const API_URL = API_DOMAIN+"/api/"
export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export const axiosPrivateInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})