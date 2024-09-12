const loginTitle: HTMLElement = document.querySelector("#login-title");
const loginForm: HTMLFormElement = document.querySelector("#login-form");

const usernameInput: HTMLInputElement = document.querySelector("#username-input");
const passwordInput: HTMLInputElement = document.querySelector("#password-input");

(async () => {
    const args = await window.login.getAct();
    const act = args.act;
    const username = args.username;

    const handleEvent = {
        handleEvent: async (event: SubmitEvent) => {
            event.preventDefault();

            const username: string = usernameInput.value;
            const password: string = passwordInput.value;

            if (act === "addUser") {
                await window.login.userAuthentication({ username: username, password: password, addUser: true });
            } else {
                await window.login.userAuthentication({ username: username, password: password });
            }
        }
    }

    if (act === "addUser") {
        loginTitle.textContent = "管理者権限で認証してください";

        usernameInput.value = username;
        usernameInput.readOnly = true;
        usernameInput.className = "form-control-plaintext";
    }

    loginForm.addEventListener("submit", handleEvent, false);
})();