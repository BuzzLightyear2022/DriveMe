export const setRadioValue = (args: { radios: NodeListOf<HTMLInputElement>, checkedValue: string }) => {
    const { radios, checkedValue } = args;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].value === checkedValue) {
            radios[i].checked = true;
        }
    }
}