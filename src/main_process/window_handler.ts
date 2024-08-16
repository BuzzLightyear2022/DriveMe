import { BrowserWindow, screen } from "electron";
import path from "path";
import { Windows } from "../@types/types";
import { ContextmenuHandler } from "./contextmenu_handler";
import dotenv from "dotenv";
dotenv.config();

const openInExtendedDisplay = (targetWindow: BrowserWindow) => {
    const displays: Electron.Display[] = screen.getAllDisplays();
    const externalDisplay: Electron.Display = displays.find(display => display.bounds.x !== 0 || display.bounds.y !== 0);

    if (externalDisplay) {
        targetWindow.setBounds(externalDisplay.bounds);
    }
}

export class WindowHandler {
    static preloadScript: string = path.join(__dirname, "preload.js");
    static windows: Windows = {
        loginWindow: undefined,
        rentalcarHandlerWindow: undefined,
        reservationHandlerWindow: undefined,
        displayReservationWindow: undefined,
        rentalcarStatusHandlerWindow: undefined,
        loanerRentalReservationHandlerWindow: undefined,
        reservationListWindow: undefined,
        searchModalWindow: undefined,
        addUserWindow: undefined,
        verifyMfaWindow: undefined
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

        loginWindow.on("close", () => { WindowHandler.windows.loginWindow = undefined });

        loginWindow.menuBarVisible = false;

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            openInExtendedDisplay(loginWindow);
            loginWindow.webContents.openDevTools();

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
                preload: WindowHandler.preloadScript,
                nodeIntegration: false
            },
        });

        ContextmenuHandler.displayMenubarMenu();
        ContextmenuHandler.displayScheduleCellMenu();
        ContextmenuHandler.displayScheduleBarMenu();
        ContextmenuHandler.displayLoanerRentalScheduleBarMenu();
        ContextmenuHandler.displayVehicleItemMenu();

        displayReservationWindow.on("close", () => { WindowHandler.windows.displayReservationWindow = undefined });

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            openInExtendedDisplay(displayReservationWindow);

            displayReservationWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/display_reservation.html`);
            WindowHandler.windows.displayReservationWindow = displayReservationWindow;

            displayReservationWindow.webContents.openDevTools();
        } else {
            displayReservationWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/display_reservation.html`));
            WindowHandler.windows.displayReservationWindow = displayReservationWindow;
        }
        displayReservationWindow.maximize();
        displayReservationWindow.webContents.openDevTools();
    }

    static createRentalcarHandlerWindow = (args?: { rentalcarId?: string, crudAction: string }): void => {
        if (!WindowHandler.windows.rentalcarHandlerWindow) {
            const { height } = screen.getPrimaryDisplay().workAreaSize;

            const win: BrowserWindow = new BrowserWindow({
                width: 800,
                height: height,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                },
            });

            win.webContents.on("dom-ready", () => {
                win.webContents.send("contextmenu:getCrudArgs", args);
            });

            win.on("close", () => {
                WindowHandler.windows.rentalcarHandlerWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                openInExtendedDisplay(win);
                win.webContents.openDevTools();

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

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            win.webContents.openDevTools();
            win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/reservation_handler.html`);
            WindowHandler.windows.reservationHandlerWindow = win;
        } else {
            win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/reservation_handler.html`));
            WindowHandler.windows.reservationHandlerWindow = win;
        }

        win.webContents.on("dom-ready", () => {
            win.webContents.send("contextmenu:getCrudArgs", args);
        });

        win.on("close", () => {
            WindowHandler.windows.rentalcarHandlerWindow = undefined;
        });
    }

    static createLoanerRentalReservationHandlerWindow = (args: { rentalCarId?: string, reservationId?: string, crudAction: string }) => {
        const win: BrowserWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                preload: WindowHandler.preloadScript
            }
        });

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            openInExtendedDisplay(win);
            win.webContents.openDevTools();

            win.loadURL(new URL("html/loaner_rental_handler.html", MAIN_WINDOW_VITE_DEV_SERVER_URL).href);
            WindowHandler.windows.loanerRentalReservationHandlerWindow = win;
        } else {
            win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/loaner_rental_handler.html`));
            WindowHandler.windows.loanerRentalReservationHandlerWindow = win;
        }

        win.webContents.on("dom-ready", () => {
            win.webContents.send("contextmenu:getCrudArgs", args);
        });

        win.on("close", () => {
            WindowHandler.windows.loanerRentalReservationHandlerWindow = undefined;
        });
    }

    static createRentalcarStatusHandlerWindow = (args: { rentalcarId: string }) => {
        if (!WindowHandler.windows.rentalcarStatusHandlerWindow) {
            const win: BrowserWindow = new BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                }
            });

            win.menuBarVisible = false;

            win.webContents.on("dom-ready", () => {
                win.webContents.send("contextmenu:getRentalCarId", args.rentalcarId);
            });

            win.on("close", () => {
                WindowHandler.windows.rentalcarStatusHandlerWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.webContents.openDevTools();
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/rentalcar_status_handler.html`);
                WindowHandler.windows.rentalcarStatusHandlerWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/rentalcar_status_handler.html`));
                WindowHandler.windows.rentalcarStatusHandlerWindow = win;
            }
        }
    }

    static createReservationListWindow = (): void => {
        if (!WindowHandler.windows.reservationListWindow) {
            const win: BrowserWindow = new BrowserWindow({
                webPreferences: {
                    preload: WindowHandler.preloadScript,
                }
            });

            win.on("close", () => {
                WindowHandler.windows.reservationListWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                openInExtendedDisplay(win);
                win.webContents.openDevTools();

                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/reservation_list.html`);
                WindowHandler.windows.reservationListWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/reservation_list.html`));
                WindowHandler.windows.reservationListWindow = win;
            }
            win.maximize();
            win.webContents.openDevTools();
        }
    }

    static createAddUserWindow = (): void => {
        if (!WindowHandler.windows.addUserWindow) {
            const win: BrowserWindow = new BrowserWindow({
                webPreferences: {
                    preload: WindowHandler.preloadScript
                }
            });

            win.on("close", () => {
                WindowHandler.windows.addUserWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                openInExtendedDisplay(win);
                win.webContents.openDevTools();

                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/add_user.html`);
                WindowHandler.windows.addUserWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/add_user.html`));
                WindowHandler.windows.addUserWindow = win;
            }

            win.webContents.openDevTools();
        }
    }

    static createVerifyMfaWindow = () => {
        if (!WindowHandler.windows.verifyMfaWindow) {
            const win: BrowserWindow = new BrowserWindow({
                webPreferences: {
                    preload: WindowHandler.preloadScript
                }
            });

            win.on("close", () => {
                WindowHandler.windows.verifyMfaWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                openInExtendedDisplay(win);
                win.webContents.openDevTools();

                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/verify_mfa.html`);
                WindowHandler.windows.verifyMfaWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/verify_mfa.html`));
                WindowHandler.windows.verifyMfaWindow = win;
            }
        }
    }
}