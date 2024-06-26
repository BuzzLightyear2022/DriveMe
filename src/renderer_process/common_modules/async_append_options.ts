export const asyncAppendOptions = async (args: { options: string[], select: HTMLSelectElement }) => {
    const promises: void[] = args.options.map((option: string) => {
        new Promise((resolve) => {
            const optionElement: HTMLOptionElement = document.createElement("option");
            optionElement.textContent = option;
            args.select.append(optionElement);
        });
    });

    await Promise.all(promises);
}