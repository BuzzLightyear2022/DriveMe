import { CarCatalog } from "../@types/types";
import { asyncAppendOptions } from "./common_modules/async_append_options";
import { formatDateForInput } from "./common_modules/format_date_for_input";

const receptionDateInput: HTMLInputElement = document.querySelector("#reception-date-input");
const receptionBranchSelect: HTMLSelectElement = document.querySelector("#reception-branch-select");
const receptionHandlerSelect: HTMLSelectElement = document.querySelector("#reception-handler-select");
const clientNameSelect: HTMLSelectElement = document.querySelector("#client-name-select");
const carModelSelect: HTMLSelectElement = document.querySelector("#car-model-select");

(async () => {
    const now = new Date();
    const todayString: string = formatDateForInput({ dateObject: now });
    receptionDateInput.value = todayString;

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

    clientNameSelect.addEventListener("change", () => {
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
    }, false)

    const rentalClasses: string[] = Object.keys(carCatalog.rentalClasses);
    const carModels: string[] = rentalClasses.flatMap((rentalClass: string) => {
        const carModels: string[] = Object.keys(carCatalog.rentalClasses[rentalClass]);
        return carModels;
    });
    await asyncAppendOptions({ options: carModels, select: carModelSelect });

})();