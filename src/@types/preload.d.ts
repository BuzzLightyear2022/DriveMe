import { RentalCar } from "./types";

export interface serverInfo {
    serverHost: () => Promise<string>;
    port: () => Promise<string>;
    imageDirectory: () => Promise<string>;
}

export interface systemTimezone {
    getSystemTimezone: () => Promise<string>;
}

export interface login {
    getSessionData: (args: {
        username: string,
        password: string
    }) => Promise<void>;
}

export interface openWindow {
    vehicleInputWindow: () => Promise<void>;
    reservationInputWindow: () => Promise<void>;
    displayReservationWindow: () => Promise<void>;
    editCarCatalogWindow: () => Promise<void>;
}

export interface fetchJson {
    carCatalog: () => Promise<CarCatalog | unknown>;
    navigations: () => Promise<Navigations | unknown>;
    carLocation: () => Promise<CarLocation | unknown>;
    selectOptions: () => Promise<SelectOptions | unknown>;
}

export interface sqlSelect {
    rentalCars: (args: { rentalClass?: string | null }) => Promise<RentalCar[]>;
    existingRentalClasses: (args: { selectedSmoking?: string }) => Promise<string[]>;
    rentalCarById: (args: { rentalcarId: string }) => Promise<RentalCar>;
    vehicleAttributesByRentalClass: (args: { rentalClass: string }) => Promise<VehicleAttributes>;
    carModels: (args: { smoking?: string, rentalClass: string }) => Promise<string[]>;
    licensePlates: (args: { smoking?: string, carModel: string }) => Promise<LicensePlatesData>;
    reservations: (args: { startDate?: Date, endDate?: Date }) => Promise<Reservation[]>;
    reservationById: (args: { reservationId: string }) => Promise<Reservation>;
    latestStatusOfRentalCars: (args: { rentalClass?: string }) => Promise<StatusOfRentalCar[]>;
}

export interface sqlInsert {
    rentalcar: (args: { rentalcar: RentalCar }) => Promise<string>;
    reservation: (reservation: Reservation) => Promise<string>;
    rentalCarStatus: (args: { rentalCarStatus: RentalCarStatus }) => Promise<void>;
}

export interface sqlUpdate {
    reservation: (reservation: Reservation) => Promise<void>;
    rentalcar: (args: { currentData: RentalCar, newData: RentalCar }) => Promise<void>
}

export interface contextmenu {
    scheduleBar: (reservationId: string) => Promise<void>;
    rentalcarItem: (args: { rentalcarId: string }) => Promise<void>;
    scheduleCell: (args: { rentalCarId: string }) => Promise<void>;
    getReservationId: () => Promise<string>;
    getRentalCarId: () => Promise<string>;
    updateReservationData: (callback: () => void) => void;
    updateVehicleAttributes: (callback: () => void) => void;
    getCrudArgs: () => any;
}

export interface webSocket {
    updateReservationData: (callback: () => void) => number;
    updateRentalcar: (callback: () => void) => number;
    updateRentalCarStatus: (callback: () => void) => number;
}

export interface dialog {
    openFile: () => Promise<string>;
    openFileCancelled: () => Promise<void>;
}

export interface removeEvent {
    wsUpdateReservationData: (eventId: number) => void;
    wsUpdateRentalcar: (eventId: number) => void;
    wsUpdateVehicleStaus: (eventId: number) => void;
}

export interface accessToken {
    get: () => Promise<string>;
}

declare global {
    interface Window {
        serverInfo: serverInfo;
        systemTimezone: systemTimezone;
        login: login;
        openWindow: openWindow;
        fetchJson: fetchJson;
        sqlSelect: sqlSelect;
        sqlInsert: sqlInsert;
        sqlUpdate: sqlUpdate
        contextmenu: contextmenu;
        webSocket: webSocket;
        dialog: dialog;
        removeEvent: removeEvent;
        accessToken: accessToken;
    }
}