import { ipcMain } from "electron";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { RentalCar, Reservation, RentalCarStatus, LoanerRentalReservation } from "../@types/types";
import { makeImageFileName } from "./common_modules";
import { accessToken } from "./login_process";
import { WindowHandler } from "./window_handler";
import dotenv from "dotenv";
dotenv.config();

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const port: string = import.meta.env.VITE_EC2_SERVER_PORT;

(async () => {
    ipcMain.handle("sqlInsert:rentalcar", async (event: Electron.IpcMainInvokeEvent, args: { rentalcar: RentalCar }): Promise<string | unknown> => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlInsert/vehicleAttributes`;

        const postData: FormData = new FormData();

        const imageFileName = makeImageFileName(args.rentalcar);
        const imageUrl: string | undefined | null = args.rentalcar.imageFileName;
        if (imageUrl) {
            const base64Image: string = imageUrl.split(";base64").pop() as string;
            const bufferImage: Buffer = Buffer.from(base64Image, "base64");
            postData.append("imageUrl", bufferImage, imageFileName);
        }

        const textData: {
            [key in keyof RentalCar]:
            | number
            | string
            | boolean
            | Date
            | null
            | RentalCarStatus[]
        } = {} as {
            [key in keyof RentalCar]:
            | number
            | string
            | boolean
            | Date
            | null
        };

        for (const key in args.rentalcar) {
            if (key !== "imageFileName" && key !== "RentalCarStatuses") {
                textData[key as keyof RentalCar] = args.rentalcar[key as keyof RentalCar];
            }
        }

        postData.append("data", JSON.stringify(textData));

        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, postData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...postData.getHeaders(),
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            WindowHandler.windows.rentalcarHandlerWindow.close();
            WindowHandler.windows.rentalcarHandlerWindow = undefined;

            return response.status;
        } catch (error: unknown) {
            return "Failed to send image data: " + error;
        }
    });
})();

(async () => {
    ipcMain.handle("sqlInsert:reservation", async (event: Electron.IpcMainInvokeEvent, data: Reservation) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlInsert/reservation`;

        const postData: FormData = new FormData();
        postData.append("data", JSON.stringify(data));

        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, postData, {
                headers: {
                    ...postData.getHeaders(),
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            if (response.status === 200) {
                WindowHandler.windows.reservationHandlerWindow.close();
                WindowHandler.windows.reservationHandlerWindow = undefined;
            }

            return response.status;
        } catch (error: unknown) {
            return `Failed to send reservation data: ${error}`;
        }
    });
})();

(async () => {
    ipcMain.handle("sqlInsert:rentalCarStatus", async (event: Electron.IpcMainEvent, args: { rentalCarStatus: RentalCarStatus }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlInsert/rentalCarStatus`;

        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            if (response.status === 200) {
                WindowHandler.windows.rentalcarStatusHandlerWindow.close();
                WindowHandler.windows.rentalcarStatusHandlerWindow = undefined;
            }
        } catch (error: unknown) {
            console.error(error);
        }
    });
})();

(async () => {
    ipcMain.handle("sqlInsert:loanerRentalReservation", async (event: Electron.IpcMainEvent, args: { loanerRentalReservation: LoanerRentalReservation }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlInsert/loanerRentalReservation`;

        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            if (response.status === 200) {
                WindowHandler.windows.loanerRentalReservationHandlerWindow.close();
            }
        } catch (error: unknown) {
            console.error(error);
        }
    });
})();