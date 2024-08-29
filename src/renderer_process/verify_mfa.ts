import { replaceFullWidthNumToHalfWidthNum } from "./common_modules/replace_fullwidthnum_to_halfwidthnum";

const windowContainer: HTMLDivElement = document.querySelector("#window-container");
const titleElement: HTMLElement = document.querySelector("#title");
const MFAForm: HTMLFormElement = document.querySelector("#mfa-form");
const submitDiv: HTMLDivElement = document.querySelector("#submit-div");
const submitButton = document.querySelector("#submit-button");

const explainText: HTMLElement = document.createElement("h2");
const mfaTokenInput: HTMLInputElement = document.createElement("input");

let step: number = 1;

const initializeMFASetup = async (userId: string) => {
    titleElement.textContent = "MFAを有効化してください";
    explainText.textContent = "Google AuthenticatorでQRコードを読み込んでください";
    titleElement.after(explainText);

    submitButton.textContent = "次へ";

    const MFASecret = await window.login.getMFASecret({ userId });
    const MFASecretImage: HTMLImageElement = document.createElement("img");
    MFASecretImage.id = "MFA-secret-img";

    if (MFASecret) {
        MFASecretImage.src = MFASecret.MFASecretImage;
    }

    explainText.after(MFASecretImage);
}

const handleFirstStep = () => {
    MFAForm.prepend(mfaTokenInput);
    replaceFullWidthNumToHalfWidthNum({ element: mfaTokenInput, limitDigits: 6 });

    const MFASecretImage: HTMLImageElement = document.querySelector("#MFA-secret-img");
    if (MFASecretImage) MFASecretImage.remove();

    explainText.textContent = "現在表示されているトークンを入力してください";
    submitButton.textContent = "検証";
    step = 2;
}

const handleSecondStep = async (userId: string) => {
    const MFAResult = await window.login.verifyMFAToken({
        userId,
        MFAToken: mfaTokenInput.value,
        isMFASetup: true,
        isFinalStep: step === 3
    });

    console.log(MFAResult);

    if (MFAResult.isMFASetup && MFAResult.success && step === 3) {
    } else if (MFAResult.isMFASetup && MFAResult.success) {
        explainText.textContent = "次に表示されるトークンを入力してください";
        mfaTokenInput.value = "";
        step = 3;
    } else {
        explainText.textContent = "無効なMFAトークンです。もう一度お試しください";
        mfaTokenInput.value = "";
        step = 2;
    }
}

(async () => {
    const userData = await window.login.getUserData();

    if (!userData.mfaEnabled) {
        await initializeMFASetup(userData.userId);

        submitButton.addEventListener("click", (event: Event) => {
            event.preventDefault();

            if (step === 1) {
                handleFirstStep();
            } else if (step >= 2) {
                handleSecondStep(userData.userId);
            }
        }, false);
    } else {
        MFAForm.prepend(mfaTokenInput);
        replaceFullWidthNumToHalfWidthNum({ element: mfaTokenInput, limitDigits: 6 });

        submitButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();

            const mfaToken: string = mfaTokenInput.value;
            const MFAResult = await window.login.verifyMFAToken({
                userId: userData.userId,
                MFAToken: mfaToken,
                isMFASetup: false,
                isFinalStep: false
            });

            console.log(MFAResult);
        }, false);
    }
})();

