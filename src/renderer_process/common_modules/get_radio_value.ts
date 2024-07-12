export const getRadioValue = (args: { radios: NodeListOf<HTMLElement>, defaultValue?: string | boolean }): string | boolean | undefined => {
    const { radios, defaultValue } = args;

    let selectedValue: string | boolean | undefined = defaultValue;
    radios.forEach((radio: HTMLInputElement): void => {
        if (radio.checked) {
            selectedValue = radio.value;
        }
    });
    return selectedValue;
}