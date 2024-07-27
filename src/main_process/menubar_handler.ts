import { WindowHandler } from "./window_handler";
import { Menu } from "electron";

export class MenubarHandler {
    static setMenubar = () => {
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
                        click: () => WindowHandler.createRentalcarHandlerWindow()
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
}