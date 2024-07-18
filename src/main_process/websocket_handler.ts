import { WindowHandler } from "./window_handler";
import dotenv from "dotenv";
dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebSocket = require("ws");

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST as string;
// @ts-ignore
const port: string = import.meta.env.VITE_EC2_SERVER_PORT as string;

let reconnectInterval: number = 5000;

export const connectWebSocket = async () => {
    const webSocket = new WebSocket(`wss://${serverHost}:${port}`);

    webSocket.on("open", () => {
        console.log("WebSocket connection established");
    });

    webSocket.on("message", async (message: string) => {
        const eventName: string = String(message);

        WindowHandler.windows.displayReservationWindow.send(eventName);
    });

    webSocket.on("close", (event: any) => {
        console.error(`webSocket is closed. Recconect will be attempted in ${reconnectInterval / 1000}`, event.reason);
        setTimeout(() => {
            connectWebSocket();
        }, reconnectInterval);
    });
}