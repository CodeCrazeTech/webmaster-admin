import { axiosPrivateInstance } from "../utils/axios"
import useAuth from "./useAuth"

export default function useLogout() {
    const { setUser, setAccessToken, setCSRFToken } = useAuth()

    const logout = async () => {
        try {
            await axiosPrivateInstance.post("auth/logout")
            setAccessToken(null)
            setCSRFToken(null)
            setUser({})

        } catch (error) {
            // console.log(error)
        }
    }

    return logout
}