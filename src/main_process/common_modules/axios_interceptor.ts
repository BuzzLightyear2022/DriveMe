import axios, { AxiosResponse } from "axios";
import { handleTokenExpired } from "./handle_token_expired";
import { handleConnectionError } from "./handle_connection_error";

const instance = axios.create();

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            if (error.response && error.response.status === 401 && error.response.data.message === "Token expired") {
                handleTokenExpired();
            }
        } else if (error.request) {
            if (typeof error.message === "string" && error.message.includes("ECONNREFUSED")) {
                handleConnectionError();
            } else {
                handleConnectionError();
                console.error("Error: ", error.message);
            }
        } else {
            console.error("Error: ", error.message);
        }

        return Promise.reject(error);
    }
);

export { instance as axios, AxiosResponse };