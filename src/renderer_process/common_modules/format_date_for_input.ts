export const formatDateForInput = (args?: { dateObject?: Date }): string | null => {
    if (args && args.dateObject) {
        const year: number = args.dateObject.getFullYear();
        const month: string = String(args.dateObject.getMonth() + 1).padStart(2, "0");
        const date: string = String(args.dateObject.getDate()).padStart(2, "0");

        const dateString = `${year}-${month}-${date}`;

        return dateString;
    } else {
        return null;
    }
}