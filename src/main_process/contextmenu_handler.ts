import { ipcMain, Menu } from "electron";
import { WindowHandler } from "./window_handler";

export class ContextmenuHandler {
    static displayMenubarMenu = () => {
        const menuTemplate = Menu.buildFromTemplate([
            {
                label: "ファイル"
            },
            {
                label: "編集"
            },
            {
                label: "予約管理",
                submenu: [
                    {
                        label: "新規予約",
                        click: () => WindowHandler.createReservationHandlerWindow({ crudAction: "create" })
                    },
                    {
                        label: "予約一覧"
                    },
                    {
                        label: "シミュレーションモード"
                    }
                ]
            },
            {
                label: "車両管理",
                submenu: [
                    {
                        label: "車両一覧"
                    },
                    {
                        label: "車両新規登録",
                        click: () => WindowHandler.createRentalcarHandlerWindow({ crudAction: "create" })
                    }
                ]
            },
            {
                label: "表示"
            },
            {
                label: "ヘルプ"
            }
        ]);

        Menu.setApplicationMenu(menuTemplate);
    }

    static displayScheduleCellMenu = () => {
        ipcMain.on("contextmenu:schedule-cell", (event: Electron.IpcMainEvent, args: { rentalCarId: string }) => {
            const { rentalCarId } = args;

            const menuTemplate = Menu.buildFromTemplate([
                {
                    label: "ステータス",
                    click: async () => {
                        WindowHandler.createRentalcarStatusHandlerWindow({ rentalcarId: rentalCarId });
                    }
                },
                {
                    label: "新規予約",
                    click: async () => {
                        WindowHandler.createReservationHandlerWindow({ rentalCarId: rentalCarId, crudAction: "create" });
                    },
                },
                {
                    label: "新規損保予約",
                    click: async () => {
                        WindowHandler.createLoanerRentalReservationHandlerWindow({ rentalCarId: rentalCarId, crudAction: "create" });
                    }
                },
                {
                    label: "点検修理",
                    click: async () => {

                    }
                }
            ]);

            menuTemplate.popup();
        });
    }

    static displayScheduleBarMenu = () => {
        ipcMain.on("contextmenu:schedule-bar", (event: Electron.IpcMainEvent, reservationId: string) => {
            const menuTemplate = Menu.buildFromTemplate([
                {
                    label: "予約変更",
                    click: async () => WindowHandler.createReservationHandlerWindow({ reservationId: reservationId, crudAction: "update" }),
                },
                {
                    label: "キャンセル",
                    click: async () => WindowHandler.createReservationHandlerWindow({ reservationId: reservationId, crudAction: "cancel" })
                }
            ]);

            menuTemplate.popup();
        });
    }

    static displayLoanerRentalScheduleBarMenu = () => {
        ipcMain.on("contextmenu:loanerRental-schedulebar", (event: Electron.IpcMainEvent, loanerRentalReservationId: string) => {
            const menuTemplate = Menu.buildFromTemplate([
                {
                    label: "損保予約変更",
                    click: async () => WindowHandler.createLoanerRentalReservationHandlerWindow({ reservationId: loanerRentalReservationId, crudAction: "update" })
                },
                {
                    label: "キャンセル",
                    click: async () => WindowHandler.createLoanerRentalReservationHandlerWindow({ reservationId: loanerRentalReservationId, crudAction: "cancel" })
                }
            ]);

            menuTemplate.popup();
        });
    }

    static displayVehicleItemMenu = () => {
        ipcMain.on("contextmenu:rentalcarItem", (event: Electron.IpcMainEvent, args: { rentalcarId: string }) => {
            const menuTemplate = Menu.buildFromTemplate([
                {
                    label: "ステータス",
                    click: async () => {
                        WindowHandler.createRentalcarStatusHandlerWindow({ rentalcarId: args.rentalcarId });
                    }
                },
                {
                    label: "車両情報更新",
                    click: async () => {
                        WindowHandler.createRentalcarHandlerWindow({ rentalcarId: args.rentalcarId, crudAction: "update" });
                    }
                },
                {
                    label: "車両削除",
                    click: () => {
                        console.log("remove vehicle");
                    }
                }
            ]);

            menuTemplate.popup(WindowHandler.windows.displayReservationWindow);
        });
    }
}