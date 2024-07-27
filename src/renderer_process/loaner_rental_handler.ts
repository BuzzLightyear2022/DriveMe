import { CarCatalog, LoanerRentalReservation, RentalCar } from "../@types/types";
import { asyncAppendOptions } from "./common_modules/async_append_options";
import { formatDateForInput } from "./common_modules/format_date_for_input";
import { formatDatetimeForInput } from "./common_modules/format_datetime_for_input";
import { rentalCarOptionsHandler } from "./common_modules/rentalCar_options_handler";
import { getRadioValue } from "./common_modules/get_radio_value";
import { setRadioValue } from "./common_modules/set_radio_value";

const titleElement: HTMLElement = document.querySelector("#title-element");
const scheduleBarColorInput: HTMLInputElement = document.querySelector("#schedulebar-color");
const receptionDateInput: HTMLInputElement = document.querySelector("#reception-date-input");
const receptionBranchSelect: HTMLSelectElement = document.querySelector("#reception-branch-select");
const receptionHandlerSelect: HTMLSelectElement = document.querySelector("#reception-handler-select");
const clientNameSelect: HTMLSelectElement = document.querySelector("#client-name-select");
const contactPersonNameInput: HTMLInputElement = document.querySelector("#contact-person-name-input");
const userName1Input: HTMLInputElement = document.querySelector("#user-name1-input");
const nonSmokingRadios: NodeListOf<HTMLInputElement> = document.getElementsByName("non-smoking") as NodeListOf<HTMLInputElement>;
const carModelSelect: HTMLSelectElement = document.querySelector("#using-car-model-select");
const usingCarModelSelect: HTMLSelectElement = document.querySelector("#using-car-model-select");
const contactTypeSelect: HTMLSelectElement = document.querySelector("#contact-type-select");
const phoneNumberFirstInput: HTMLInputElement = document.querySelector("#phone-number-first-input");
const phoneNumberSecondInput: HTMLInputElement = document.querySelector("#phone-number-second-input");
const phoneNumberThirdInput: HTMLInputElement = document.querySelector("#phone-number-third-input");
const dispatchDatetimeInput: HTMLInputElement = document.querySelector("#dispatch-datetime-input");
const dispatchLocationInput: HTMLInputElement = document.querySelector("#dispatch-location-input");
const remarksInput: HTMLInputElement = document.querySelector("#remarks-input");
const insuranceProviderInput: HTMLInputElement = document.querySelector("#insurance-provider-input");
const insuranceProviderCoordinatorInput: HTMLInputElement = document.querySelector("#insurance-provider-coordinator-input");
const insuranceProviderPhoneInput: HTMLInputElement = document.querySelector("#insurance-provider-phone-input");
const repairFacilityInput: HTMLInputElement = document.querySelector("#repair-facility-input");
const repairFacilityRepresentativeInput: HTMLInputElement = document.querySelector("#repair-facility-representative-input");
const repairFacilityPhoneInput: HTMLInputElement = document.querySelector("#repair-facility-phone-input");
const caseNumberInput: HTMLInputElement = document.querySelector("#case-number-input");
const accidentDateInput: HTMLInputElement = document.querySelector("#accident-date-input");
const policyNumberInput: HTMLInputElement = document.querySelector("#policy-number-input");
const coverageCategorySelect: HTMLSelectElement = document.querySelector("#coverage-category-select");
const dailyAmountInput: HTMLInputElement = document.querySelector("#daily-amount-input");
const recompenseCheck: HTMLInputElement = document.querySelector("#recompense-check");
const policyholderNameInput: HTMLInputElement = document.querySelector("#policyholder-name-input");
const userName2Input: HTMLInputElement = document.querySelector("#user-name2-input");
const pickupLocationInput: HTMLInputElement = document.querySelector("#pickup-location-input");
const ownedCarInput: HTMLInputElement = document.querySelector("#owned-car-input");
const transportLocationInput: HTMLInputElement = document.querySelector("#transport-location-input");
const limitDateInput: HTMLInputElement = document.querySelector("#limit-date-input");
const rentalClass: HTMLSelectElement = document.querySelector("#rental-class");
const carModel: HTMLSelectElement = document.querySelector("#car-model");
const rentalCarId: HTMLSelectElement = document.querySelector("#rentalcar-id");
const submitButton: HTMLButtonElement = document.querySelector("#submit-button");

const getSubmitData = (args?: { reservationId?: string }): LoanerRentalReservation => {
    let nonSmoking: string = getRadioValue({ radios: nonSmokingRadios });
    return {
        id: args && args.reservationId ? args.reservationId : null,
        receptionDate: receptionDateInput.value ? new Date(receptionDateInput.value) : null,
        receptionBranch: receptionBranchSelect.value,
        receptionHandler: receptionHandlerSelect.value,
        clientName: clientNameSelect.value,
        contactPersonName: contactPersonNameInput.value,
        nonSmoking: nonSmoking,
        userName1: userName1Input.value,
        usingCarModel: usingCarModelSelect.value,
        contactType: contactTypeSelect.value,
        phoneNumberFirst: phoneNumberFirstInput.value,
        phoneNumberSecond: phoneNumberSecondInput.value,
        phoneNumberThird: phoneNumberThirdInput.value,
        dispatchDatetime: dispatchDatetimeInput.value ? new Date(dispatchDatetimeInput.value) : null,
        dispatchLocation: dispatchLocationInput.value,
        remarks: remarksInput.value,
        insuranceProvider: insuranceProviderInput.value,
        insuranceProviderCoordinator: insuranceProviderCoordinatorInput.value,
        insuranceProviderPhone: insuranceProviderPhoneInput.value,
        repairFacility: repairFacilityInput.value,
        repairFacilityRepresentative: repairFacilityRepresentativeInput.value,
        repairFacilityPhone: repairFacilityPhoneInput.value,
        caseNumber: caseNumberInput.value,
        accidentDate: accidentDateInput.value ? new Date(accidentDateInput.value) : null,
        policyNumber: policyNumberInput.value,
        coverageCategory: coverageCategorySelect.value,
        dailyAmount: Number(dailyAmountInput.value),
        recompense: recompenseCheck.checked,
        policyholderName: policyholderNameInput.value,
        userName2: userName2Input.value,
        pickupLocation: pickupLocationInput.value,
        ownedCar: ownedCarInput.value,
        transportLocation: transportLocationInput.value,
        limitDate: limitDateInput.value ? new Date(limitDateInput.value) : null,
        selectedRentalClass: rentalClass.value,
        selectedCarModel: carModel.value,
        selectedRentalcarId: rentalCarId.value,
        scheduleBarColor: scheduleBarColorInput.value,
        isCanceled: false
    }
}

const clientNameSelectHandler = () => {
    if (clientNameSelect.value === "other") {
        const clientNameRow: HTMLDivElement = document.querySelector("#client-name-row");

        const col: HTMLDivElement = document.createElement("div");
        col.id = "other-client-name-col";
        col.className = "col mb-1";

        const formFloating: HTMLDivElement = document.createElement("div");
        formFloating.className = "form-floating";

        const label: HTMLLabelElement = document.createElement("label");
        label.textContent = "その他損保会社・代理店";
        label.htmlFor = "other-client-name-input";

        const input: HTMLInputElement = document.createElement("input");
        input.className = "form-control";
        input.id = "other-client-name-input";

        formFloating.append(input, label);
        col.append(formFloating);
        clientNameRow.append(col);

        input.focus();
    } else {
        const otherClientNameCol: HTMLDivElement = document.querySelector("#other-client-name-col");
        if (otherClientNameCol) {
            otherClientNameCol.remove();
        }
    }
}

(async () => {
    const crudArgs = await window.contextmenu.getCrudArgs();

    const selectOptions = await window.fetchJson.selectOptions();
    const carCatalog: CarCatalog = await window.fetchJson.carCatalog();

    const branchOptions: string[] = Object.keys(selectOptions.branches);
    await asyncAppendOptions({ options: branchOptions, select: receptionBranchSelect });

    const staffMembers: string[] = selectOptions.staffMembers;
    await asyncAppendOptions({ options: staffMembers, select: receptionHandlerSelect });

    const clients: string[] = ["べるべる", "買取１番", "神楽店", "末広店", "豊岡店", "損保ジャパン旭川", "東京海上日動旭川", "東海手配センター"];
    await asyncAppendOptions({ options: clients, select: clientNameSelect });
    const otherOption: HTMLOptionElement = document.createElement("option");
    otherOption.textContent = "その他損保会社・代理店";
    otherOption.value = "other";
    clientNameSelect.append(otherOption);

    clientNameSelect.addEventListener("change", clientNameSelectHandler, false);

    const rentalClasses: string[] = Object.keys(carCatalog.rentalClasses);
    const carModels: string[] = rentalClasses.flatMap((rentalClass: string) => {
        const carModels: string[] = Object.keys(carCatalog.rentalClasses[rentalClass]);
        return carModels;
    });
    await asyncAppendOptions({ options: carModels, select: carModelSelect });

    await rentalCarOptionsHandler({});

    switch (crudArgs.crudAction) {
        case "create":
            titleElement.textContent = "損保予約情報を入力してください";

            if (crudArgs && crudArgs.rentalCarId) {
                rentalCarOptionsHandler({ rentalCarId: crudArgs.rentalCarId });
            }

            const now = new Date();
            const todayString: string = formatDateForInput({ dateObject: now });
            receptionDateInput.value = todayString;

            scheduleBarColorInput.value = "#ff0000";

            submitButton.addEventListener("click", () => {
                const submitData: LoanerRentalReservation = getSubmitData();
                window.sqlInsert.loanerRentalReservation({ loanerRentalReservation: submitData });
            }, false);

            break;
        case "update":
            titleElement.textContent = "損保予約情報を更新します";

            const existingLoanerRentalReservation: LoanerRentalReservation = await window.sqlSelect.loanerRentalReservationById({ reservationId: crudArgs.reservationId });
            console.log(existingLoanerRentalReservation);

            scheduleBarColorInput.value = existingLoanerRentalReservation.scheduleBarColor ? existingLoanerRentalReservation.scheduleBarColor : "#ff0000";
            receptionDateInput.value = formatDateForInput({ dateObject: new Date(existingLoanerRentalReservation.receptionDate) });
            receptionBranchSelect.value = existingLoanerRentalReservation.receptionBranch;
            receptionHandlerSelect.value = existingLoanerRentalReservation.receptionHandler;
            clientNameSelect.value = existingLoanerRentalReservation.clientName;
            contactPersonNameInput.value = existingLoanerRentalReservation.contactPersonName;
            setRadioValue({ radios: nonSmokingRadios, checkedValue: existingLoanerRentalReservation.nonSmoking });
            userName1Input.value = existingLoanerRentalReservation.userName1;
            carModelSelect.value = existingLoanerRentalReservation.usingCarModel;
            contactTypeSelect.value = existingLoanerRentalReservation.contactType;
            phoneNumberFirstInput.value = existingLoanerRentalReservation.phoneNumberFirst;
            phoneNumberSecondInput.value = existingLoanerRentalReservation.phoneNumberSecond;
            phoneNumberThirdInput.value = existingLoanerRentalReservation.phoneNumberThird;
            dispatchDatetimeInput.value = formatDatetimeForInput({ dateObject: new Date(existingLoanerRentalReservation.dispatchDatetime) });
            dispatchLocationInput.value = existingLoanerRentalReservation.dispatchLocation;
            remarksInput.value = existingLoanerRentalReservation.remarks;
            insuranceProviderInput.value = existingLoanerRentalReservation.insuranceProvider;
            insuranceProviderCoordinatorInput.value = existingLoanerRentalReservation.insuranceProviderCoordinator;
            insuranceProviderPhoneInput.value = existingLoanerRentalReservation.insuranceProviderPhone;
            repairFacilityInput.value = existingLoanerRentalReservation.repairFacility;
            repairFacilityRepresentativeInput.value = existingLoanerRentalReservation.repairFacilityRepresentative;
            repairFacilityPhoneInput.value = existingLoanerRentalReservation.repairFacilityPhone;
            caseNumberInput.value = existingLoanerRentalReservation.caseNumber;
            accidentDateInput.value = existingLoanerRentalReservation.accidentDate ? formatDateForInput({ dateObject: new Date(existingLoanerRentalReservation.accidentDate) }) : null;
            policyNumberInput.value = existingLoanerRentalReservation.policyNumber;
            coverageCategorySelect.value = existingLoanerRentalReservation.coverageCategory;
            dailyAmountInput.value = String(existingLoanerRentalReservation.dailyAmount);
            recompenseCheck.checked = existingLoanerRentalReservation.recompense;
            policyholderNameInput.value = existingLoanerRentalReservation.policyholderName;
            userName2Input.value = existingLoanerRentalReservation.userName2;
            pickupLocationInput.value = existingLoanerRentalReservation.pickupLocation;
            ownedCarInput.value = existingLoanerRentalReservation.ownedCar;
            transportLocationInput.value = existingLoanerRentalReservation.transportLocation;
            limitDateInput.value = formatDateForInput({ dateObject: new Date(existingLoanerRentalReservation.limitDate) });
            rentalClass.value = existingLoanerRentalReservation.selectedRentalClass;
            carModel.value = existingLoanerRentalReservation.selectedCarModel;
            rentalCarId.value = existingLoanerRentalReservation.selectedRentalcarId;

            submitButton.addEventListener("click", () => {
                const submitData: LoanerRentalReservation = getSubmitData({ reservationId: crudArgs.reservationId });
                window.sqlUpdate.loanerRentalReservation(submitData);
            });

            break;
    }
})();

