const loginForm: HTMLFormElement = document.querySelector("#login-form");

const usernameInput: HTMLInputElement = document.querySelector("#username-input");
const passwordInput: HTMLInputElement = document.querySelector("#password-input");

const handleEvent = {
    handleEvent: async (event: SubmitEvent) => {
        event.preventDefault();

        const username: string = usernameInput.value;
        const password: string = passwordInput.value;

        await window.login.getSessionData({ username: username, password: password });
    }
}

loginForm.addEventListener("submit", handleEvent, false);