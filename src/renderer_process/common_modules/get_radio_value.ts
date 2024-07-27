export const getRadioValue = (args: { radios: NodeListOf<HTMLElement>, defaultValue?: string }): string => {
    const { radios, defaultValue } = args;

    let selectedValue: string = defaultValue;
    radios.forEach((radio: HTMLInputElement): void => {
        if (radio.checked) {
            selectedValue = radio.value;
        }
    });
    return selectedValue;
}