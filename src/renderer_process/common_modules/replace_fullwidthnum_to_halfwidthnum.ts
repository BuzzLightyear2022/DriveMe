export const replaceFullWidthNumToHalfWidthNum = (args: { element: HTMLInputElement, limitDigits?: number }): void => {
    const fullWidthNumbersRegExp = new RegExp(/[０-９]/g);
    const NotHalfWidthBumbersRegExp = new RegExp(/[^0-9]/g);
    const fullWidthNumbers = "０１２３４５６７８９";

    let isComposing: boolean = false;

    args.element.addEventListener("compositionstart", (): void => {
        isComposing = true;
    }, false);

    args.element.addEventListener("compositionend", (): void => {
        isComposing = false;
        replaceNumbers();
    });

    args.element.addEventListener("input", (): void => {
        if (!isComposing) {
            replaceNumbers();
        }
    }, false);

    const replaceNumbers = (): void => {
        let inputtedValue: string = String(args.element.value);
        const inputtedValueLength: number = inputtedValue.length;

        inputtedValue = inputtedValue.replace(fullWidthNumbersRegExp, (match: string): string => {
            return String(fullWidthNumbers.indexOf(match));
        });

        args.element.value = args.element.value.replace(NotHalfWidthBumbersRegExp, "");

        if (args.limitDigits && inputtedValueLength > args.limitDigits) {
            inputtedValue = inputtedValue.slice(0, args.limitDigits);
        }

        args.element.value = inputtedValue;
    }
}