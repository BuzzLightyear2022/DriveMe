import { BrowserWindow } from "electron";
import { WindowHandler } from "./window_handler";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebSocket = require("ws");

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST as string;
// @ts-ignore
const port: string = import.meta.env.VITE_EC2_SERVER_PORT as string;

const uuidFilePath: string = path.join(".", "driveme_client_uuid.txt");

let reconnectInterval: number = 5000;
let reconnectTimer: NodeJS.Timeout | null = null;

const getClientUUID = (): string => {
    if (fs.existsSync(uuidFilePath)) {
        return fs.readFileSync(uuidFilePath, "utf-8");
    } else {
        const newUUID = crypto.randomUUID();
        fs.writeFileSync(uuidFilePath, newUUID);
        return newUUID;
    }
}

let webSocket: WebSocket | null = null;

export const connectWebSocket = async () => {
    const clientId: string = getClientUUID();

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected");
        return;
    }

    webSocket = new WebSocket(`wss://${serverHost}:${port}`);

    webSocket.onopen = () => {
        console.log("WebSocket is connected");

        const message = JSON.stringify({ type: "register", clientId });
        console.log("Sending message to server: ", message);
        webSocket?.send(message);

        if (reconnectTimer) {
            clearInterval(reconnectTimer);
            reconnectTimer = null;
        }
    }

    webSocket.onclose = (event: any) => {
        console.error(`WebSocket is closed. Recconect will be attempted in ${reconnectInterval / 1000} seconds.`);

        if (!reconnectTimer) {
            reconnectTimer = setInterval(() => {
                connectWebSocket();
            }, reconnectInterval);
        }
    }

    webSocket.onmessage = async (event: MessageEvent) => {
        const message: string = event.data;
        const eventName: string = String(message);

        const displayReservationWindow: BrowserWindow = WindowHandler.windows.displayReservationWindow;

        if (displayReservationWindow && displayReservationWindow.webContents) {
            displayReservationWindow.webContents.send("event-name", eventName);
        } else {
            console.error("displayReservationWindow or its webContents is not defined");
        }
    };

    webSocket.onerror = (error: any) => {
        console.error(error);
    }
}