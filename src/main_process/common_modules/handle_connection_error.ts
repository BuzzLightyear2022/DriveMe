import { dialog } from 'electron';
import { WindowHandler } from '../window_handler';

let isDialogShown: boolean = false;

// export const handleConnectionError = () => {
//     if (!isDialogShown) {
//         isDialogShown = true;
//         dialog.showErrorBox("Connection Error", "サーバーが応答しません\nサーバー管理者に連絡してください");

//         WindowHandler.windows.displayReservationWindow.close();
//         WindowHandler.createLoginWindow();

//         setTimeout(() => {
//             isDialogShown = false;
//         }, 1000);
//     }
// }

export const handleConnectionError = () => {
    dialog.showErrorBox("Connection Error", "サーバーが応答しません\nサーバー管理者に連絡してください");

    WindowHandler.windows.displayReservationWindow.close();
    WindowHandler.createLoginWindow();
}