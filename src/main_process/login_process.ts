import { ipcMain, dialog } from "electron";
import { axios, AxiosResponse } from "./common_modules/axios_interceptor";

import { WindowHandler } from "./window_handler";
import { connectWebSocket } from "./websocket_handler";

export let accessToken: string;

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const serverPort: string = import.meta.env.VITE_EC2_SERVER_PORT;

ipcMain.handle("login:userAuthentication", async (event, data) => {
    const serverEndPoint = `https://${serverHost}:${serverPort}/login/userAuthentication`;

    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, data);

        WindowHandler.windows.loginWindow.close();
        WindowHandler.createVerifyMfaWindow({ userData: response.data });
    } catch (error: any) {
        if (error.response) {
            console.log(error.response.status);
            if (error.response.status === 401) {
                dialog.showErrorBox("Authenticate Error", "ログインできません");
            } else if (error.response.status === 403) {
                dialog.showErrorBox("Authenticate Error", "サーバー管理者に連絡してください");
            }
        }
    }
});

ipcMain.handle("login:generateMFASecret", async (event, data) => {
    const serverEndPoint = `https://${serverHost}:${serverPort}/login/generateMFASecret`;

    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, data);
        return response.data;
    } catch (error: any) {
        console.error(error);
    }
});

ipcMain.handle("login:verifyMFAToken", async (event, data) => {
    const serverEndPoint = `https://${serverHost}:${serverPort}/login/verifyMFAToken`;

    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, data);
        if (response.data.isMFASetup && response.data.isFinalStep) {
            WindowHandler.windows.verifyMfaWindow.close();
            WindowHandler.createLoginWindow();
            dialog.showMessageBox(WindowHandler.windows.loginWindow, { message: "MFAが有効化されました\nログインしてください" });
        }
        return response.data;
    } catch (error: any) {
        console.error(error);
        return { success: false, message: "MFA verification failed" };
    }
});

// (async () => {
//     ipcMain.handle("login:getSessionData", async (event, data) => {
//         try {
//             const response: AxiosResponse = await axios.post(serverEndPoint, data);

//             WindowHandler.createVerifyMfaWindow();

//             WindowHandler.windows.loginWindow.close();
//         } catch (error: any) {
//             if (error.response) {
//                 if (error.response.status === 401) {
//                     dialog.showErrorBox("Authenticate Error", "ログインできません");
//                 } else if (error.response.status === 403) {
//                     dialog.showErrorBox("Authenticate Error", "サーバー管理者に連絡してください");
//                 }
//             }
//         }
//     });
// })();