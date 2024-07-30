import { ipcMain, dialog } from "electron";
import axios, { AxiosResponse } from "axios";

import { WindowHandler } from "./window_handler";
import { connectWebSocket } from "./websocket_handler";

export let accessToken: string;

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const serverPort: string = import.meta.env.VITE_EC2_SERVER_PORT;

const serverEndPoint = `https://${serverHost}:${serverPort}/login/getSessionData`;

(async () => {
    ipcMain.handle("login:getSessionData", async (event, data) => {
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, data);
            accessToken = response.data;

            WindowHandler.createDisplayReservationWindow();

            connectWebSocket();

            WindowHandler.windows.loginWindow.close();
        } catch (error: any) {
            console.error(error);

            if (error.response) {
                if (error.response.status === 401) {
                    dialog.showErrorBox("Authenticate Error", "ログインできません");
                } else if (error.response.status === 403) {
                    dialog.showErrorBox("Authenticate Error", "サーバー管理者に連絡してください");
                }
            } else {
                dialog.showErrorBox("Connection Error", "サーバー管理者に連絡してください");
            }
        }
    });
})();