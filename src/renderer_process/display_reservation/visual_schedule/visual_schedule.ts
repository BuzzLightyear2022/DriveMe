import { LoanerRentalReservation, Reservation } from "../../../@types/types";
import { ScheduleCell } from "./schedule_cell";
import { ScheduleBar } from "./schedule_bar";

export class VisualSchedule extends HTMLElement {
    constructor(args: { calendarDateElement: Element }) {
        const { calendarDateElement } = args;

        super();

        const calendarDateWidth: number = calendarDateElement.getBoundingClientRect().width;

        Object.assign(this.style, {
            display: "flex",
            flexDirection: "column",
            minWidth: `${calendarDateWidth}px`,
            whiteSpace: "nowrap"
        });

        (async () => {
            this.appendScheduleCells();
            await this.appendScheduleBars({ calendarDateElement: calendarDateElement });
            this.adjustScheduleBars();
        })();
    }

    appendScheduleCells = (): void => {
        const rentalCarItems: NodeListOf<Element> = document.querySelectorAll("rental-car-item");

        rentalCarItems.forEach((rentalCarItem: Element) => {
            const scheduleCell: ScheduleCell = new ScheduleCell({ rentalCarItem: rentalCarItem });
            this.append(scheduleCell);
        });
    }

    appendScheduleBars = async (args: { calendarDateElement: Element }) => {
        const { calendarDateElement } = args;

        const calendarStartTimestamp: number = Number(calendarDateElement.getAttribute("calendar-start-timestamp"));
        const calendarEndTimestamp: number = Number(calendarDateElement.getAttribute("calendar-end-timestamp"));
        const calendarStartDate: Date = new Date(calendarStartTimestamp);
        const calendarEndDate: Date = new Date(calendarEndTimestamp);

        const scheduleCells: HTMLCollection = this.children;

        const monthReservations: Reservation[] = await window.sqlSelect.reservations({ startDate: calendarStartDate, endDate: calendarEndDate });
        const monthLoanerRentalReservations: LoanerRentalReservation[] = await window.sqlSelect.loanerRentalReservations({ startDate: calendarStartDate, endDate: calendarEndDate });

        if (monthReservations && monthReservations.length) {
            await Promise.all(monthReservations.map((reservation: Reservation) => {
                const selectedVehicleId: number = Number(reservation.selectedVehicleId);
                for (let scheduleCell of scheduleCells) {
                    const scheduleCellRentalCarId: number = Number(scheduleCell.getAttribute("data-rentalCar-id"));
                    if (selectedVehicleId === scheduleCellRentalCarId && !reservation.isCanceled) {
                        const scheduleBar: ScheduleBar = new ScheduleBar({ calendarDateElement: calendarDateElement, reservation: reservation });
                        // scheduleBar.style.height = `${100 / (scheduleCell.children.length + 1)}%`;
                        // scheduleBar.style.top = `${Array.from(scheduleCell.children).length * 50}%`;
                        scheduleCell.appendChild(scheduleBar);
                    }
                }
            }));
        }

        if (monthLoanerRentalReservations && monthLoanerRentalReservations.length) {
            await Promise.all(monthLoanerRentalReservations.map((loanerRentalReservation: LoanerRentalReservation) => {
                const selectedRentalcarId: number = Number(loanerRentalReservation.selectedRentalcarId);
                for (const scheduleCell of scheduleCells) {
                    const scheduleCellRentalcarId: number = Number(scheduleCell.getAttribute("data-rentalCar-id"));
                    if (selectedRentalcarId === scheduleCellRentalcarId && !loanerRentalReservation.isCanceled) {
                        const scheduleBar: ScheduleBar = new ScheduleBar({ calendarDateElement: calendarDateElement, loanerRentalReservation: loanerRentalReservation });
                        // scheduleBar.style.height = `${100 / (scheduleCell.children.length + 1)}%`;
                        // scheduleBar.style.top = `${Array.from(scheduleCell.children).length * 50}%`;
                        scheduleCell.appendChild(scheduleBar);
                    }
                }
            }));
        }
    }

    adjustScheduleBars = (): void => {
        const scheduleCells: NodeListOf<ScheduleCell> = this.querySelectorAll('schedule-cell');

        scheduleCells.forEach(scheduleCell => {
            const scheduleBars: NodeListOf<ScheduleBar> = scheduleCell.querySelectorAll('schedule-bar');
            const positions: any[][] = [];

            scheduleBars.forEach(scheduleBar => {
                const barRect: DOMRect = scheduleBar.getBoundingClientRect();
                let placed: boolean = false;

                for (let rowIndex = 0; rowIndex < positions.length; rowIndex++) {
                    if (!positions[rowIndex].some((pos: any) => this.areOverlapping(barRect, pos))) {
                        positions[rowIndex].push(barRect);
                        scheduleBar.dataset.rowIndex = rowIndex.toString();
                        placed = true;
                        break;
                    }
                }

                if (!placed) {
                    positions.push([barRect]);
                    scheduleBar.dataset.rowIndex = (positions.length - 1).toString();
                }

                const maxRows = positions.length;

                scheduleBars.forEach(scheduleBar => {
                    const rowIndex = parseInt(scheduleBar.dataset.rowIndex, 10);
                    scheduleBar.style.height = `${100 / maxRows}%`;
                    scheduleBar.style.top = `${rowIndex * (100 / maxRows)}%`;
                });
            });
        });
    }

    areOverlapping = (rect1: DOMRect, rect2: DOMRect): boolean => {
        return !(rect1.right <= rect2.left ||
            rect1.left >= rect2.right ||
            rect1.bottom <= rect2.top ||
            rect1.top >= rect2.bottom);
    }
}

customElements.define("visual-schedule", VisualSchedule);