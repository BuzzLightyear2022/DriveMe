import { BrowserWindow, screen } from "electron";
import path from "path";
import { Windows } from "../@types/types";
import { ContextmenuHandler } from "./contextmenu_handler";
import { accessToken } from "./login_process";
import dotenv from "dotenv";
dotenv.config();

export class WindowHandler {
    static preloadScript: string = path.join(__dirname, "preload.js");
    static windows: Windows = {
        loginWindow: undefined,
        rentalcarHandlerWindow: undefined,
        reservationHandlerWindow: undefined,
        displayReservationWindow: undefined,
        statusOfRentalcarHandlerWindow: undefined,
        loanerRentalHandlerWindow: undefined
    }

    static createLoginWindow = () => {
        const loginWindow: BrowserWindow = new BrowserWindow(
            {
                width: 300,
                height: 300,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                },
                resizable: false
            }
        );

        loginWindow.menuBarVisible = false;

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            loginWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
            WindowHandler.windows.loginWindow = loginWindow;
        } else {
            loginWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
            WindowHandler.windows.loginWindow = loginWindow;
        }
    }

    static createDisplayReservationWindow = () => {
        const displayReservationWindow: BrowserWindow = new BrowserWindow({
            webPreferences: {
                preload: WindowHandler.preloadScript
            },
        });

        ContextmenuHandler.displayMenubarMenu();
        ContextmenuHandler.displayScheduleCellMenu();
        ContextmenuHandler.displayScheduleBarMenu();
        ContextmenuHandler.displayVehicleItemMenu();

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            displayReservationWindow.loadURL(new URL("html/display_reservation.html", MAIN_WINDOW_VITE_DEV_SERVER_URL).href);
            WindowHandler.windows.displayReservationWindow = displayReservationWindow;

            displayReservationWindow.webContents.openDevTools();
            displayReservationWindow.maximize();
        } else {
            displayReservationWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/display_reservation.html`));
            WindowHandler.windows.displayReservationWindow = displayReservationWindow;
        }
    }

    static createRentalcarHandlerWindow = (args?: { rentalcarId?: string }): void => {
        if (!WindowHandler.windows.rentalcarHandlerWindow) {
            const { height } = screen.getPrimaryDisplay().workAreaSize;

            const win: BrowserWindow = new BrowserWindow({
                width: 800,
                height: height,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                },
            });

            // win.webContents.openDevTools();

            win.webContents.on("dom-ready", () => {
                win.webContents.send("accessToken", accessToken);
            });

            win.on("closed", () => {
                WindowHandler.windows.rentalcarHandlerWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/rentalcar_handler.html`);
                WindowHandler.windows.rentalcarHandlerWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/rentalcar_handler.html`));
                WindowHandler.windows.rentalcarHandlerWindow = win;
            }
        } else {
            console.log("window is already created");
        }
    }

    static createReservationHandlerWindow = (args: { rentalCarId?: string, reservationId?: string, crudAction: string }): void => {
        const win: BrowserWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                preload: WindowHandler.preloadScript
            },
        });

        win.webContents.openDevTools();

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/rentalcar_handler.html`);
            WindowHandler.windows.rentalcarHandlerWindow = win;
        } else {
            win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/rentalcar_handler.html`));
            WindowHandler.windows.rentalcarHandlerWindow = win;
        }

        win.webContents.on("dom-ready", () => {
            win.webContents.send("contextmenu:getCrudArgs", args);
        });

        win.on("close", () => {
            WindowHandler.windows.rentalcarHandlerWindow = undefined;
        });
    }

    static createLoanerRentalHandlerWindow = (args: { rentalCarId?: string, reservationId?: string, crudAction: string }) => {
        const win: BrowserWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                preload: WindowHandler.preloadScript
            }
        });

        win.webContents.openDevTools();

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/loaner_rental_handler.html`);
            WindowHandler.windows.loanerRentalHandlerWindow = win;
        } else {
            win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/loaner_rental_handler.html`));
            WindowHandler.windows.loanerRentalHandlerWindow = win;
        }

        win.webContents.on("dom-ready", () => {
            win.webContents.send("contextmenu:getCrudArgs", args);
        });

        win.on("close", () => {
            WindowHandler.windows.loanerRentalHandlerWindow = undefined;
        });
    }

    static createStatusOfRentalcarHandlerWindow = (args: { rentalcarId: string }) => {
        if (!WindowHandler.windows.statusOfRentalcarHandlerWindow) {
            const win: BrowserWindow = new BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                }
            });

            win.webContents.openDevTools();

            win.menuBarVisible = false;

            win.webContents.on("dom-ready", () => {
                win.webContents.send("contextmenu:getRentalCarId", args.rentalcarId);
            });

            win.on("closed", () => {
                WindowHandler.windows.statusOfRentalcarHandlerWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/status_of_rentalCar_handler.html`);
                WindowHandler.windows.statusOfRentalcarHandlerWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/status_of_rentalCar_handler.html`));
                WindowHandler.windows.statusOfRentalcarHandlerWindow = win;
            }
        }
    }
}