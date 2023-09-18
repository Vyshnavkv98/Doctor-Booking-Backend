
import NotFoundError from "../../utils/notFoundError";
import env from "../../environment/env";
import jwt from "jsonwebtoken";
import { IDoctorModelInterface } from "../../models/interface";
import sendMailVerification from "../../utils/sendMailVerification";
import NodeCache = require("node-cache");
import DoctorRepository from "../../repositories/doctorRepository";
import { Doctor } from '../../models/doctorModel'
import { ISlotInterface } from '../../interfaces/doctorSlot'
import badRequestError from "../../utils/badRequestError";
import { number } from "zod";
import { strict } from "assert";



type doctorDataType = {
    email: string,
    password: string
};

type jwtType = {
    iv: Buffer,
    _id: string
};

type doctorCacheType = {
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    dob?: Date | string,
}
type doctorCache = {
    _id: string,
    specialization: string,
    gender: string,
    city: string,
    RegisterFee: Number,
    registrationCouncil: string,
    registrationYear: string,
    registerNumber: string,
    imgUrl: string,
    image: string,
    AddressLine1:string,
    AddressLine2:string,
    offline:boolean,
    chat:boolean,
    video:boolean
}


const doctorRepository = new DoctorRepository();


const doctorCache = new NodeCache()
const otpCache = new NodeCache()

const unknownDoctorType = Doctor as unknown;
const doctorStaticType = unknownDoctorType as {
    findByCreds: (email: string, password: string) => Promise<IDoctorModelInterface>;
};

class doctorServices {
    constructor() {
    }
    createUser = async (doctordata: doctorCacheType) => {
        const response = await sendMailVerification(doctordata.firstName!, doctordata.email!)
        if (!response) {
            throw new NotFoundError("Cannot find otp")
        }
        doctorCache.set(doctordata.email!, doctordata)
        otpCache.set(doctordata.email!, response)
        console.log(response, 'from sentemail');




    }

    verifyOtp = async (otp: string, email: string) => {

        console.log(email, 'verify otp 56');

        const doctorData: any = doctorCache.get(email)
        console.log(doctorData);

        const genOtp = otpCache.get(email)
        console.log(genOtp, otp);

        if (otp === genOtp) {
            const doctor = new Doctor({
                firstName: doctorData.firstname,
                lastName: doctorData.lastname,
                email: doctorData.email,
                emailVerified: true,
                phoneNumber: doctorData.phonenumber,
                password: doctorData.password,


            })

            await doctor.save()
            if (!doctor) throw new NotFoundError("User not Found")
        } else {
            throw new Error('Otp not matching retry again')
        }

    }


    login = async (doctorData: doctorDataType, uuid: string | undefined) => {



        const email = doctorData.email;
        const password = doctorData.password;

        const doctor = await doctorStaticType.findByCreds(email, password);

        if (!doctor) throw new NotFoundError("Cannot Find User");
        console.log(doctor, 'doctor');

        const { accessToken, refreshToken } = await doctor.generateAuthToken(uuid);
        console.log(accessToken, refreshToken, 'service');


        if (!accessToken || !refreshToken) throw new NotFoundError("Login User Not Found Error");



        return { doctor, accessToken, refreshToken }
    }

    logout = async (userid: string, refreshToken: string) => {

        const doctor = await Doctor.findById(userid)
        if (doctor === undefined || doctor === null) throw new NotFoundError("Could Not Find User");

        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, env.passwordRefresh!) as jwtType
            const encryptionkey = 'my-encryption-key'
            const encryptedToken = doctor?.encryptToken(refreshToken, encryptionkey, decoded.iv)
            const tokenLength = doctor?.token?.length

            if (tokenLength) {
                for (let i = 0; i < tokenLength; i++) {

                    const currentEncryptedToken = doctor.token![i].token;

                    if (currentEncryptedToken === encryptedToken) {

                        doctor.token!.splice(i, 1);
                        console.log("logut from service");

                        await doctor.save();
                        break;
                    }
                }
            }
        }
        await doctor.save()
    }

    logoutAll = async (userid: string) => {

        const doctor = await Doctor.findById(userid);
        console.log(doctor, 'logoutall');

        if (!doctor) throw new NotFoundError("Could Not Find doctor");
        doctor.token = [];
        await doctor.save();
    }
    verification = async (doctorData: doctorCache) => {

        const Doctor = doctorRepository.getDoctorServices(doctorData._id)
        const res = await doctorRepository.updateDoctorData(doctorData)

        return res
    }

    addSlots = async (slotData: ISlotInterface) => {
        if (!slotData.formattedDate) {
            throw new badRequestError('Please select the date')
        }
        else {
            const slotDetails = await doctorRepository.findSlotDetails(slotData)
            const slots = slotDetails?.AvailableSlots as any
            if (slots !== undefined) {
                const dateExists = slots.some((item: any) => item.date === slotData?.formattedDate);
                if (dateExists) {
                    if (slotDetails) {
                        const indexToUpdate = slotDetails.AvailableSlots?.findIndex(
                            (slot) => slot.date === slotData.formattedDate 
                        );
                        console.log(indexToUpdate);
                            
                        if (indexToUpdate !==undefined) {
                            const updatedData = await doctorRepository.updateSlot(slotData, indexToUpdate)
                            
                            

                            return updatedData
                        }
                    }
                } else {
                    const updatedSlotData = await doctorRepository.addNewSlot(slotData)
                    return updatedSlotData
                }
            }
        }
    }

    getSlots=async(id:string)=>{
        const doctor=await doctorRepository.getDoctorSlots(id)
        if (!doctor) throw new NotFoundError("Could Not Find doctor");
        else{
           return doctor?.AvailableSlots
        }

    }
    getDepartments = async () => {
        const departmentDetails = await doctorRepository.getDepartments()

        if (departmentDetails) return departmentDetails
    }
}
export default doctorServices;