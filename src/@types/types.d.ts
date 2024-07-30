import { Datetime } from "aws-sdk/clients/costoptimizationhub"
import { time } from "aws-sdk/clients/frauddetector"

export type Windows = {
    loginWindow: BrowserWindow | undefined,
    rentalcarHandlerWindow: BrowserWindow | undefined,
    reservationHandlerWindow: BrowserWindow | undefined,
    displayReservationWindow: BrowserWindow | undefined,
    rentalcarStatusHandlerWindow: BrowserWindow | undefined,
    loanerRentalReservationHandlerWindow: BrowserWindow | undefined,
    reservationListWindow: BrowserWindow | undefined
}

export type CarCatalog = {
    rentalClasses: {
        [rentalClassName: string]: {
            [carModel: string]: {
                modelCode?: string[],
                modelTrim?: string[],
                driveType?: string[],
                transmission?: string[],
                bodyColor?: string[]
            }
        }
    }
}

export type RentalCar = {
    id?: string,
    imageFileName?: string,
    carModel: string,
    modelCode: string,
    modelTrim: string,
    seatingCapacity: number,
    nonSmoking: boolean,
    insurancePriority: boolean,
    licensePlateRegion: string,
    licensePlateCode: string,
    licensePlateHiragana: string,
    licensePlateNumber: string,
    bodyColor: string,
    driveType: string,
    transmission: string,
    rentalClass: string,
    navigation: string,
    hasBackCamera: boolean,
    hasDVD: boolean,
    hasTelevision: boolean,
    hasExternalInput: boolean,
    hasETC: boolean,
    hasSpareKey: boolean,
    hasJAFCard: boolean,
    JAFCardNumber?: string,
    JAFCardExp?: Date,
    otherFeatures?: string,
    RentalCarStatuses?: RentalCarStatus[] | null
}

export type Reservation = {
    id?: string
    isReplied: boolean,
    receptionDate: Date,
    repliedDatetime: Date,
    salesBranch: string,
    orderHandler: string,
    orderSource: string,
    userNameFurigana: string,
    nonSmoking: string,
    userName: string,
    preferredRentalClass: string,
    isElevatable: boolean,
    isClassSpecified: boolean,
    applicantName: string,
    preferredCarModel: string,
    applicantZipCode: string,
    applicantAddress: string,
    applicantPhoneNumber: string,
    pickupLocation: string,
    returnLocation: string,
    pickupDatetime: Datetime,
    arrivalFlightCarrier: string,
    arrivalFlightNumber: string,
    arrivalFlightTime: time,
    returnDatetime: Datetime,
    departureFlightCarrier: string,
    departureFlightNumber: string,
    departureFlightTime: time,
    selectedRentalClass: string,
    selectedCarModel: string,
    selectedVehicleId: string,
    comment: string,
    isCanceled: boolean,
    cancelComment: string,
    scheduleBarColor: string,
    createdAt: datetime,
    updatedAt: datetime
}

export type LoanerRentalReservation = {
    id?: string | null,
    receptionDate: Date,
    receptionBranch: string,
    receptionHandler: string,
    clientName: string,
    contactPersonName: string,
    nonSmoking: string,
    userName1: string,
    usingCarModel: string,
    contactType: string,
    phoneNumberFirst: string,
    phoneNumberSecond: string,
    phoneNumberThird: string,
    dispatchDatetime: Date,
    dispatchLocation: string,
    remarks: string,
    insuranceProvider: string,
    insuranceProviderCoordinator: string,
    insuranceProviderPhone: string,
    repairFacility: string,
    repairFacilityRepresentative: string,
    repairFacilityPhone: string,
    caseNumber: string,
    accidentDate: Date,
    policyNumber: string,
    coverageCategory: string,
    dailyAmount: number,
    recompense: boolean,
    policyholderName: string,
    userName2: string,
    pickupLocation: string,
    ownedCar: string,
    transportLocation: string,
    limitDate: Date,
    selectedRentalClass: string,
    selectedCarModel: string,
    selectedRentalcarId: string,
    scheduleBarColor: string,
    isCanceled: boolean
}

export type LicensePlate = {
    id: number,
    licensePlate: string,
    nonSmoking: boolean
}

export type Navigations = {
    navigations: string[]
}

export type CalendarInfo = {
    innerVehicleScheduleContainer: HTMLDivElment | undefined;
    year: number | undefined;
    monthIndex: number | undefined;
    vehicleAttributesArray: VehicleAttributes[];
}

export type ScheduleBarInfo = {
    reservationData: ReservationData;
    divElement: HTMLDivElement;
    instance
}

export type IntersectObject = {
    observer: IntersectionObserver;
    divElement: HTMLDivElement;
}

export type CarLocation = {
    location: string[];
}

export type RentalCarStatus = {
    id?: number,
    rentalCarId: string,
    currentLocation: string,
    washState: string,
    comment: string,
    createdAt: Datetime,
    updatedAt: Datetime
}

interface Branch {
    phoneNumber: number
}

export type SelectOptions = {
    branches: {
        [branchName: string]: { phoneNumber: number }
    },
    staffMembers: string[],
    orderSources: string[],
    flightCarriers: string[]
}