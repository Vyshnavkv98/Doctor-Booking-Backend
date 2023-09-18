import { ObjectId } from "mongoose";
import { Document } from "mongoose";

export interface IDoctorModelInterface extends Document {
    firstName: string,
    lastName: string,
    age?: number,
    gender?: string,
    phoneNumber?: string,
    email: string,
    fee?: number,
    imgUrl?: string,
    specialization?: string,
    address?: string,
    contact?: Number,
    password: string,
    department?: string,
    AvailableSlots?: [{
        date: string;
        slots: string[];
    }],
    videoConsultationSlots:[
        {
            date: string;
            slots: string[];
        }
    ],
    city?: string,
    RegistrationYear?: string,
    RegistartionCouncil?: string,
    RegisterNumber?: string,
    RegisterFee?: Number,
    qualification?: string,
    isApproved?: boolean,
    isBlocked?: boolean,
    isVerified?: boolean,
    AddressLine1: string,
    AddressLine2: string,
    image?: Buffer | string,
    documents?: string[],
    token?: any[],
    blockReason?: string,
    chat: boolean,
    offline: boolean,
    video: boolean,
    getEncryptionKey: () => Buffer | undefined,
    findByCreds: (email: string, password: string) => Promise<IDoctorModelInterface>,
    generateTempAuthToken: () => Promise<any>,
    generateEncryptionKey: () => Buffer | undefined,
    encryptToken: (tempToken: any, key: any, publicKey: any) => any;
    decryptToken: (encryptedToken: any, key: any, publicKey: any) => any;
    generateAuthToken: (uuid: string | undefined) => Promise<{ accessToken: string, refreshToken: string }>

}

export interface IDepartment {
    departmentImg: string,
    status: string,
    departmentHead: string,
    departmentName: string
}

export type userEditType = {
    userId: string,
    firstName?: string,
    address: string,
    city: string,
    bloodGroup: string,
    district: string,
    phoneNumber: string
    gender: string,
    profileImg: string
}
interface PrescriptionItem {
    medicine: string;
    timing: string;
}
export interface IAppointmentInterface {
    user: string,
    doctor: string,
    name: string,
    status: string,
    email: string,
    mobile: string,
    fee: number,
    note: string,
    reason: string,
    prescription: PrescriptionItem[],
    date: string,
    time: string,
    isAttended: boolean,
    payment: string,
    consultationMode: string
}

export interface IAppointmentDataType {
    name: string,
    email: string,
    reason: string,
    mobile: string,
    time: string,
    date: string,
    fee: number,
    userId: string,
    doctorId: string,
    doctorFee: number,
    payment: string




}