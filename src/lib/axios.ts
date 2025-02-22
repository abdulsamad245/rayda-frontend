import axios, { AxiosError } from "axios"
import { getCookie } from "./utils/cookies";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") { 
      const token = getCookie("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorData = (error as AxiosError)?.response?.data || error;
    if (errorData?.errors) {
      for (const [, value] of Object.entries(errorData.errors.errors)) {
        if (Array.isArray(value) && value.length > 0) {
          errorData.message = value[0];
          break;
        } else if (typeof value === "string") {
          errorData.message = value;
          break;
        }
      }
    }

    return Promise.reject(errorData);
  }
)

export default instance
