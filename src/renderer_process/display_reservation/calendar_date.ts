import { getDayString } from "../common_modules/common_modules";

export class CalendarDate extends HTMLElement {
    constructor(args: { dateObject: Date }) {
        super();

        const { dateObject } = args;

        const currentDateObject: Date = new Date();
        const currentDate: Date = new Date(currentDateObject.getFullYear(), currentDateObject.getMonth(), currentDateObject.getDate());

        const calendarYear: number = dateObject.getFullYear();
        const calendarMonthIndex: number = dateObject.getMonth();
        const calendarDays: number = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();

        const calendarStartTimestamp: string = String(new Date(calendarYear, calendarMonthIndex, 1, 0, 0, 0, 0).getTime());
        const calendarEndTimestamp: string = String(new Date(calendarYear, calendarMonthIndex + 1, 0, 23, 59, 59, 999).getTime());

        this.setAttribute("calendar-start-timestamp", calendarStartTimestamp);
        this.setAttribute("calendar-end-timestamp", calendarEndTimestamp);

        Object.assign(this.style, {
            display: "flex",
            flexDirection: "row",
            flexBasis: "auto",
            flexGrow: 1,
            flexShrink: 1,
            whiteSpace: "nowrap",
            overflow: "visible"
        });

        (async () => {
            const holidays: string[] | undefined = await this.getHolidays();
            const promises = [];

            for (let date = 1; date <= calendarDays; date++) {
                const dateCell: HTMLDivElement = document.createElement("div");
                Object.assign(dateCell.style, {
                    display: "flex",
                    justifyContent: "center",
                    minWidth: "120px",
                    height: "50px",
                    lineHeight: "200%",
                    fontSize: "150%",
                    border: "solid",
                    marginLeft: "-1px",
                    borderWidth: "1px",
                    cursor: "default",
                    userSelect: "none"
                });

                const dateCellDate: Date = new Date(calendarYear, calendarMonthIndex, date);

                const dayIndex: number = dateCellDate.getDay();
                const dayString: string = getDayString({ dayIndex: dayIndex });

                dateCell.textContent = date === 1 ? `${calendarMonthIndex + 1}/${date}(${dayString})` : `${date}(${dayString})`;

                if (currentDate.getTime() === dateCellDate.getTime()) {
                    Object.assign(dateCell.style, {
                        borderColor: "yellow",
                        borderWidth: "10px",
                        lineHeight: "calc(200% - 20px)"
                    });
                }

                if (dayIndex === 0) {
                    dateCell.style.background = "#ff0033";
                } else if (dayIndex === 6) {
                    dateCell.style.background = "#0582ff";
                }

                holidays.forEach((holiday: string) => {
                    const holidayDate: Date = new Date(holiday);
                    holidayDate.setHours(holidayDate.getHours() - 9);

                    if (dateCellDate.getTime() === holidayDate.getTime()) {
                        Object.assign(dateCell.style, {
                            color: "black",
                            background: "radial-gradient(circle closest-corner, rgba(255, 0, 0, 1) 25%, rgba(255, 255, 255, 1) 20%)"
                        })
                    }
                });

                promises.push(new Promise((resolve) => {
                    this.appendCallback(dateCell);
                    resolve(dateCell);
                }));

                // this.append(dateCell);
                await Promise.all(promises);
            }
        })();
    }

    getHolidays = async (): Promise<string[] | undefined> => {
        try {
            const response = await fetch("https://holidays-jp.github.io/api/v1/date.json");
            const jsonResponse = await response.json();
            return Object.keys(jsonResponse);
        } catch (error) {
            console.error(`Failed to fetch holidays: ${error}`);
            return undefined;
        }
    }

    appendCallback = (dateCell: HTMLElement) => {
        this.append(dateCell);
    }
}

customElements.define("calendar-date", CalendarDate);