export const formatDatetimeForInput = (args: { dateObject: Date }): string => {
    const { dateObject } = args;

    const year: number = dateObject.getFullYear();
    const month: string = String(dateObject.getMonth() + 1).padStart(2, "0");
    const date: string = String(dateObject.getDate()).padStart(2, "0");
    const hours: string = String(dateObject.getHours()).padStart(2, "0");
    const minutes: string = String(dateObject.getMinutes()).padStart(2, "0");
    const dateString: string = `${year}-${month}-${date}T${hours}:${minutes}`;

    return dateString;
}