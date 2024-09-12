import { UserData } from "../../src/@types/types";

const newUsernameInput: HTMLInputElement = document.querySelector("#new-username-input");
const newUserPasswordInput: HTMLInputElement = document.querySelector("#new-user-password-input");
const newUserPasswordConfirmationInput: HTMLInputElement = document.querySelector("#new-user-password-confirmation-input");
const newUserRoleSelect: HTMLSelectElement = document.querySelector("#role-select");
const submitButton: HTMLButtonElement = document.querySelector("#submit-button");

submitButton.addEventListener("click", async (event: Event) => {
    event.preventDefault();

    const userData: UserData = {
        username: newUsernameInput.value,
        password: newUserPasswordInput.value,
        role: newUserRoleSelect.value as "admin" | "employee" | "part-time"
    }
    await window.sqlInsert.user({ userData: userData });
}, false);