import { RentalCar } from "../../@types/types";

export const makeImageFileName = (rentalCar: RentalCar): string => {
    const carModel: string = rentalCar.carModel;
    const licensePlateNumber: string = rentalCar.licensePlateNumber;
    const modelCode: string = rentalCar.modelCode;
    const timestamp: number = new Date().getTime();
    const imageFileName = `${carModel}${licensePlateNumber}${modelCode}${timestamp}.jpeg`;
    return imageFileName;
}