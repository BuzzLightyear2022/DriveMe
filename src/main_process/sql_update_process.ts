import { ipcMain } from "electron";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { makeImageFileName } from "./common_modules/makeImageFIleName";
import { LoanerRentalReservation, RentalCar, Reservation } from "../@types/types";
import { accessToken } from "./login_process";
import { WindowHandler } from "./window_handler";
import dotenv from "dotenv";
dotenv.config();

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const port: string = import.meta.env.VITE_EC2_SERVER_PORT;

(async () => {
    ipcMain.on("sqlUpdate:rentalcar", async (event: Electron.IpcMainInvokeEvent, args: { currentData: RentalCar, newData: RentalCar }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlUpdate/rentalcar`;

        const postData: FormData = new FormData();

        if (args && args.newData && args.newData.imageFileName) {
            if (args.currentData.imageFileName && args.newData.imageFileName === args.currentData.imageFileName) {
                postData.append("imageUrl", args.currentData.imageFileName);
            } else {
                const imageFileName: string = makeImageFileName(args.newData);
                const imageUrl: string = args.newData.imageFileName;

                if (imageUrl) {
                    const base64Image: string = imageUrl.split(";base64").pop();
                    const bufferImage: Buffer = Buffer.from(base64Image, "base64");
                    postData.append("imageUrl", bufferImage, imageFileName);
                }
            }
        } else if (args && args.currentData && args.currentData.imageFileName) {
            postData.append("imageUrl", args.currentData.imageFileName);
        }
        // if ((args && args.newData && args.newData.imageFileName) && (args && args.newData && args.newData.imageFileName) && (args.newData.imageFileName === args.currentData.imageFileName)) {
        //     const emptyBuffer = Buffer.alloc(0);
        //     postData.append("imageUrl", emptyBuffer, args.currentData.imageFileName);
        // } else {
        //     const imageFileName: string = makeImageFileName(args.newData);
        //     const imageUrl: string | null = args.newData.imageFileName;
        //     if (imageUrl) {
        //         const base64Image: string = imageUrl.split(";base64,").pop();
        //         const bufferImage: Buffer = Buffer.from(base64Image, "base64");
        //         postData.append("imageUrl", bufferImage, imageFileName);
        //     }
        // }

        const textData: {
            [key in keyof RentalCar]:
            | string
            | number
            | boolean
            | Date
            | null
            | any
        } = {} as {
            [key in keyof RentalCar]:
            | string
            | number
            | boolean
            | Date
            | null
            | any
        };

        for (const key in args.newData) {
            if (key !== "imageFileName") {
                textData[key as keyof RentalCar] = args.newData[key as keyof RentalCar];
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

            if (response.status === 200) {
                WindowHandler.windows.rentalcarHandlerWindow.close();
                WindowHandler.windows.rentalcarHandlerWindow = undefined;
            }
        } catch (error: unknown) {
            console.log("Failed to send vehicleAttributes data: " + error);
        }
    });
})();

(async () => {
    ipcMain.on("sqlUpdate:reservation", async (event: Electron.IpcMainInvokeEvent, data: Reservation) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlUpdate/reservation`;

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
            }
        } catch (error: unknown) {
            return `Failed to update reservation data ${error}`;
        }
    });
})();

(async () => {
    ipcMain.on("sqlUpdate:loanerRentalReservation", async (event: Electron.IpcMainInvokeEvent, data: LoanerRentalReservation) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlUpdate/loanerRentalReservation`;

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
                WindowHandler.windows.loanerRentalReservationHandlerWindow.close();
            }
        } catch (error: unknown) {
            console.error(error);
        }

    });
})();