import { CarCatalog, RentalCar, Navigations } from "../@types/types";
import { replaceFullWidthNumToHalfWidthNum } from "./common_modules/replace_fullwidthnum_to_halfwidthnum";
import { asyncAppendOptions } from "./common_modules/async_append_options";
import { formatDateForInput } from "./common_modules/format_date_for_input";
import NoImagePng from "../assets/NoImage.png";
import squareAndArrowUpCircleFill from "../assets/square.and.arrow.up.circle.fill@2x.png";

const titleH1: HTMLElement = document.querySelector("#title");
const submitButton: HTMLButtonElement = document.querySelector("#submit-button");
const imagePreviewContainer: HTMLDivElement = document.querySelector("#image-preview-container");
const rentalcarImage: HTMLImageElement = document.querySelector("#rentalcar-image");
let rentalcarImageSrc: string | null = null;
const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class");
const carModelSelect: HTMLSelectElement = document.querySelector("#car-model");
const modelCodeSelect: HTMLSelectElement = document.querySelector("#model-code");
const modelTrimSelect: HTMLSelectElement = document.querySelector("#model-trim");
const seatingCapacityInput: HTMLInputElement = document.querySelector("#seating-capacity");
const driveTypeSelect: HTMLSelectElement = document.querySelector("#drive-type");
const transmissionSelect: HTMLSelectElement = document.querySelector("#transmission");
const bodyColorSelect: HTMLSelectElement = document.querySelector("#body-color");
const nonSmokingCheck: HTMLInputElement = document.querySelector("#non-smoking");
const insurancePriorityCheck: HTMLInputElement = document.querySelector("#insurance-priority");
const licensePlateRegionSelect: HTMLSelectElement = document.querySelector("#license-plate-region");
const licensePlateCodeInput: HTMLInputElement = document.querySelector("#license-plate-code");
const licensePlateHiraganaSelect: HTMLSelectElement = document.querySelector("#license-plate-hiragana");
const licensePlateNumberInput: HTMLInputElement = document.querySelector("#license-plate-number");
const navigationSelect: HTMLSelectElement = document.querySelector("#navigation");
const hasBackCameraCheck: HTMLInputElement = document.querySelector("#has-back-camera");
const hasDVDCheck: HTMLInputElement = document.querySelector("#has-DVD");
const hasTelevisionCheck: HTMLInputElement = document.querySelector("#has-television");
const hasExternalInputCheck: HTMLInputElement = document.querySelector("#has-external-input");
const hasETCCheck: HTMLInputElement = document.querySelector("#has-ETC");
const hasSpareKeyCheck: HTMLInputElement = document.querySelector("#has-spare-key");
const hasJAFCardCheck: HTMLInputElement = document.querySelector("#has-JAFcard");
const JAFCardNumberInput: HTMLInputElement = document.querySelector("#JAFcard-number");
const JAFCardExpInput: HTMLInputElement = document.querySelector("#JAFcard-exp");
const otherFeaturesInput: HTMLInputElement = document.querySelector("#other-features");

const createOptions = async (args?: { changedSelect: string }): Promise<void> => {
    const carCatalog: CarCatalog = await window.fetchJson.carCatalog();

    const appendCarModels = async () => {
        while (carModelSelect.firstChild) {
            carModelSelect.removeChild(carModelSelect.firstChild);
        }

        const selectedRentalClass: string = rentalClassSelect.value;

        const carModels: string[] = Object.keys(carCatalog.rentalClasses[selectedRentalClass]);
        await asyncAppendOptions({ options: carModels, select: carModelSelect });
    }

    const appendOtherOptions = async () => {
        while (modelCodeSelect.firstChild) {
            modelCodeSelect.removeChild(modelCodeSelect.firstChild);
        }

        while (modelTrimSelect.firstChild) {
            modelTrimSelect.removeChild(modelTrimSelect.firstChild);
        }

        while (driveTypeSelect.firstChild) {
            driveTypeSelect.removeChild(driveTypeSelect.firstChild);
        }

        while (transmissionSelect.firstChild) {
            transmissionSelect.removeChild(transmissionSelect.firstChild);
        }

        while (bodyColorSelect.firstChild) {
            bodyColorSelect.removeChild(bodyColorSelect.firstChild);
        }

        const selectedRentalClass = rentalClassSelect.value;
        const selectedCarModel = carModelSelect.value;
        const selectedCarModelOptions: {
            bodyColor?: string[],
            driveType?: string[],
            modelCode?: string[],
            modelTrim?: string[],
            transmission?: string[]
        } = carCatalog.rentalClasses[selectedRentalClass][selectedCarModel];

        if (selectedCarModelOptions && selectedCarModelOptions.modelCode) {
            const modelCodes: string[] = selectedCarModelOptions.modelCode;
            await asyncAppendOptions({ options: modelCodes, select: modelCodeSelect });
        }

        if (selectedCarModelOptions && selectedCarModelOptions.modelTrim) {
            const modelTrims: string[] = selectedCarModelOptions.modelTrim;
            await asyncAppendOptions({ options: modelTrims, select: modelTrimSelect });
        }

        if (selectedCarModelOptions && selectedCarModelOptions.driveType) {
            const driveTypes: string[] = selectedCarModelOptions.driveType;
            await asyncAppendOptions({ options: driveTypes, select: driveTypeSelect });
        }

        if (selectedCarModelOptions && selectedCarModelOptions.transmission) {
            const transmissions: string[] = selectedCarModelOptions.transmission;
            await asyncAppendOptions({ options: transmissions, select: transmissionSelect });
        }

        if (selectedCarModelOptions && selectedCarModelOptions.bodyColor) {
            const bodyColors: string[] = selectedCarModelOptions.bodyColor;
            await asyncAppendOptions({ options: bodyColors, select: bodyColorSelect });
        }
    }

    if ((carCatalog && carCatalog.rentalClasses) && !args) {
        const rentalClasses: string[] = Object.keys(carCatalog.rentalClasses);
        await asyncAppendOptions({ options: rentalClasses, select: rentalClassSelect });

        appendCarModels();
        appendOtherOptions();
    }

    if (args && args.changedSelect) {
        switch (args.changedSelect) {
            case "rentalClass":
                appendCarModels();
                appendOtherOptions();

                break;
            case "carModel":
                appendOtherOptions();

                break;
        }
    }
}

const imageInputHandler = async (args?: { imageFileName?: string }) => {
    const serverHost: string = await window.serverInfo.serverHost();
    const port: string = await window.serverInfo.port();
    const imageDirectory: string = await window.serverInfo.imageDirectory();

    const overlayElement = document.createElement("div");
    Object.assign(overlayElement.style, {
        position: "absolute",
        bottom: "15px",
        right: "10px",
        width: "50px",
        height: "50px",
        backgroundImage: `url(${squareAndArrowUpCircleFill})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        zIndex: "1"
    });

    overlayElement.addEventListener("mouseenter", (event: MouseEvent) => {
        event.stopPropagation();
    }, false);

    overlayElement.addEventListener("mouseleave", (event: MouseEvent) => {
        event.stopPropagation();
    }, false);

    rentalcarImage.addEventListener("dragstart", (event: MouseEvent) => {
        event.preventDefault();
    }, false);

    if (args && args.imageFileName) {
        rentalcarImage.src = `https://${serverHost}:${port}/${imageDirectory}/${args.imageFileName}`;
        rentalcarImageSrc = args.imageFileName;
    } else {
        rentalcarImage.src = NoImagePng;
        rentalcarImageSrc = null;
    }

    imagePreviewContainer.addEventListener("click", async () => {
        try {
            const imageUrl = await window.dialog.openFile();
            if ((args && args.imageFileName) && imageUrl) {
                rentalcarImage.src = imageUrl;
                rentalcarImageSrc = imageUrl;
            } else if ((args && args.imageFileName) && window.dialog.openFileCancelled()) {
                rentalcarImage.src = `https://${serverHost}:${port}/${imageDirectory}/${args.imageFileName}`;
                rentalcarImageSrc = args.imageFileName;
            } else if (imageUrl) {
                rentalcarImage.src = imageUrl;
                rentalcarImageSrc = imageUrl;
            } else {
                rentalcarImage.src = NoImagePng;
                rentalcarImageSrc = null;
            }
        } catch (error: unknown) {
            console.error(error);
        }
    }, false);

    imagePreviewContainer.addEventListener("mouseenter", () => {
        imagePreviewContainer.append(overlayElement);
    }, false);

    imagePreviewContainer.addEventListener("mouseleave", () => {
        overlayElement.remove();
    }, false);
}

const getSubmitData = (args?: { rentalcarId?: string }) => {
    const rentalcar: RentalCar = {
        id: args.rentalcarId,
        imageFileName: rentalcarImageSrc,
        carModel: carModelSelect.value,
        modelCode: modelCodeSelect.value,
        modelTrim: modelTrimSelect.value,
        seatingCapacity: Number(seatingCapacityInput.value),
        nonSmoking: nonSmokingCheck.checked,
        insurancePriority: insurancePriorityCheck.checked,
        licensePlateRegion: licensePlateRegionSelect.value,
        licensePlateCode: licensePlateCodeInput.value,
        licensePlateHiragana: licensePlateHiraganaSelect.value,
        licensePlateNumber: licensePlateNumberInput.value,
        bodyColor: bodyColorSelect.value,
        driveType: driveTypeSelect.value,
        transmission: transmissionSelect.value,
        rentalClass: rentalClassSelect.value,
        navigation: navigationSelect.value,
        hasBackCamera: hasBackCameraCheck.checked,
        hasDVD: hasDVDCheck.checked,
        hasTelevision: hasTelevisionCheck.checked,
        hasExternalInput: hasExternalInputCheck.checked,
        hasETC: hasETCCheck.checked,
        hasSpareKey: hasSpareKeyCheck.checked,
        otherFeatures: otherFeaturesInput.value,
        hasJAFCard: hasJAFCardCheck.checked,
        JAFCardNumber: JAFCardNumberInput.value,
        JAFCardExp: new Date(JAFCardExpInput.value)
    }

    if (args && args.rentalcarId) {
        rentalcar.id = args.rentalcarId
    }
    return rentalcar;
}

const jafCardInputHandler = () => {
    hasJAFCardCheck.checked ? JAFCardNumberInput.disabled = false : JAFCardNumberInput.disabled = true;
    hasJAFCardCheck.checked ? JAFCardExpInput.disabled = false : JAFCardExpInput.disabled = true;
}

replaceFullWidthNumToHalfWidthNum({ element: seatingCapacityInput, limitDigits: 2 });
replaceFullWidthNumToHalfWidthNum({ element: licensePlateCodeInput, limitDigits: 3 });
replaceFullWidthNumToHalfWidthNum({ element: licensePlateNumberInput, limitDigits: 4 });
replaceFullWidthNumToHalfWidthNum({ element: JAFCardNumberInput, limitDigits: 3 });

(async () => {
    const crudArgs: { crudAction: string, rentalcarId: string } = await window.contextmenu.getCrudArgs();

    const navigations: Navigations = await window.fetchJson.navigations();
    await asyncAppendOptions({ options: navigations.navigations, select: navigationSelect });

    await createOptions();

    hasJAFCardCheck.addEventListener("change", jafCardInputHandler, false);

    switch (crudArgs.crudAction) {
        case "create":
            titleH1.textContent = "車両情報を入力してください";

            await imageInputHandler();
            jafCardInputHandler();

            submitButton.addEventListener("click", async () => {
                const submitData: RentalCar = getSubmitData();
                await window.sqlInsert.rentalcar({ rentalcar: submitData });
            }, false);

            break;
        case "update":
            titleH1.textContent = "車両情報を更新します";

            const rentalcar: RentalCar = await window.sqlSelect.rentalCarById({ rentalcarId: crudArgs.rentalcarId });

            if (rentalcar && rentalcar.imageFileName) {
                imageInputHandler({ imageFileName: rentalcar.imageFileName });
            } else {
                imageInputHandler();
            }

            rentalClassSelect.value = rentalcar.rentalClass;
            await createOptions({ changedSelect: "rentalClass" });

            carModelSelect.value = rentalcar.carModel;
            await createOptions({ changedSelect: "carModel" });

            modelCodeSelect.value = rentalcar.modelCode;
            modelTrimSelect.value = rentalcar.modelTrim;
            seatingCapacityInput.value = String(rentalcar.seatingCapacity);
            driveTypeSelect.value = rentalcar.driveType;
            transmissionSelect.value = rentalcar.transmission;
            bodyColorSelect.value = rentalcar.bodyColor;
            licensePlateRegionSelect.value = rentalcar.licensePlateRegion;
            licensePlateCodeInput.value = rentalcar.licensePlateCode;
            licensePlateHiraganaSelect.value = rentalcar.licensePlateHiragana;
            licensePlateNumberInput.value = rentalcar.licensePlateNumber;
            nonSmokingCheck.checked = rentalcar.nonSmoking;
            insurancePriorityCheck.checked = rentalcar.insurancePriority;
            navigationSelect.value = rentalcar.navigation;
            hasBackCameraCheck.checked = rentalcar.hasBackCamera;
            hasDVDCheck.checked = rentalcar.hasDVD;
            hasTelevisionCheck.checked = rentalcar.hasTelevision;
            hasExternalInputCheck.checked = rentalcar.hasExternalInput;
            hasETCCheck.checked = rentalcar.hasETC;
            hasSpareKeyCheck.checked = rentalcar.hasSpareKey;
            hasJAFCardCheck.checked = rentalcar.hasJAFCard;
            JAFCardNumberInput.value = rentalcar.JAFCardNumber;

            if (rentalcar.JAFCardExp) {
                JAFCardExpInput.value = formatDateForInput({ dateObject: new Date(rentalcar.JAFCardExp) });
            }

            otherFeaturesInput.value = rentalcar.otherFeatures;

            jafCardInputHandler();

            submitButton.addEventListener("click", async () => {
                const submitData: RentalCar = getSubmitData({ rentalcarId: crudArgs.rentalcarId });
                await window.sqlUpdate.rentalcar({ currentData: rentalcar, newData: submitData });
            }, false);

            break;
    }

    const vehicleId: string = await window.contextmenu.getRentalCarId();
    const currentVehicleAttributes: RentalCar = await window.sqlSelect.rentalCarById({ rentalcarId: vehicleId });

    licensePlateRegionSelect.value = currentVehicleAttributes.licensePlateRegion;
    licensePlateCodeInput.value = currentVehicleAttributes.licensePlateCode;
    licensePlateHiraganaSelect.value = currentVehicleAttributes.licensePlateHiragana;
    licensePlateNumberInput.value = currentVehicleAttributes.licensePlateNumber;
    nonSmokingCheck.checked = currentVehicleAttributes.nonSmoking;
    insurancePriorityCheck.checked = currentVehicleAttributes.insurancePriority;

    navigationSelect.value = currentVehicleAttributes.navigation;

    hasBackCameraCheck.checked = currentVehicleAttributes.hasBackCamera;
    hasDVDCheck.checked = currentVehicleAttributes.hasDVD;
    hasTelevisionCheck.checked = currentVehicleAttributes.hasTelevision;
    hasExternalInputCheck.checked = currentVehicleAttributes.hasExternalInput;
    hasSpareKeyCheck.checked = currentVehicleAttributes.hasSpareKey;
    hasJAFCardCheck.checked = currentVehicleAttributes.hasJAFCard;
    JAFCardNumberInput.value = currentVehicleAttributes.JAFCardNumber;
    JAFCardExpInput.value = String(currentVehicleAttributes.JAFCardExp).split("T")[0];
    otherFeaturesInput.value = currentVehicleAttributes.otherFeatures;
})();

rentalClassSelect.addEventListener("change", () => {
    createOptions({ changedSelect: "rentalClass" });
}, false);

carModelSelect.addEventListener("change", () => {
    createOptions({ changedSelect: "carModel" });
}, false)