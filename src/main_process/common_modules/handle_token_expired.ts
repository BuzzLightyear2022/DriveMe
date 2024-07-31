import { dialog } from "electron";
import { WindowHandler } from "../window_handler";

let isTokenExpiredDialogShown: boolean = false;

export const handleTokenExpired = () => {
    if (!isTokenExpiredDialogShown) {
        isTokenExpiredDialogShown = true;
        dialog.showErrorBox("Session Expired", "セッションが期限切れです\n再度ログインしてください");

        WindowHandler.windows.displayReservationWindow.close();

        WindowHandler.createLoginWindow();

        setTimeout(() => {
            isTokenExpiredDialogShown = false;
        }, 5000);
    }
}