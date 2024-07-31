import axios, { AxiosResponse } from "axios";
import { handleTokenExpired } from "./handle_token_expired";

const instance = axios.create();

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401 && error.response.data.message === "Token expired") {
            handleTokenExpired();
        }
        return Promise.reject(error);
    }
);

export { instance as axios, AxiosResponse };