import { Appointment } from "../models/appointments";
import { Department } from "../models/departments";
import { Doctor } from "../models/doctorModel";
import { IAppointmentDataType, IAppointmentInterface, userEditType } from "../models/interface";
import User from "../models/user";
import InternalServerError from "../utils/InternalServerError";
import NotFoundError from "../utils/notFoundError";


class UserRepository {
    constructor() {

    }
    async updateEditedUserProfile(userData: userEditType) {
        const { firstName, address, city, gender, district, bloodGroup, userId, profileImg, phoneNumber } = userData
        const updatedUser = await User.findByIdAndUpdate(userId, {
            firstName: firstName,
            address: address,
            city: city,
            gender: gender,
            district: district,
            bloodGroup: bloodGroup,
            profileImg: profileImg,
            phoneNumber: phoneNumber

        }, { new: true })
        if (!updatedUser) throw new NotFoundError('Cannot find user')
        return updatedUser
    }

    async isExist(email: string) {
        const isREgister = await User.find({ email: email })
        return isREgister
    }
    async getDoctors() {
        const doctors = await Doctor.find()
        return doctors
    }

    async addOfflineAppointmentData(appointmentData:IAppointmentDataType){

        const{name,email,reason,fee,mobile,date,time,userId,doctorId,doctorFee}=appointmentData
        
        const addedAppointment= new Appointment({
            user:userId,
            doctor:doctorId,
            name,
            email,
            mobile,
            fee,
            date,
            reason,
            time,
            payment:'pending',
            consultationMode:'offline'
        })
        await addedAppointment.save()
        if(addedAppointment) return addedAppointment
        else throw new Error('Add appointment failed')
        
    }

    async getDepartments(){
        const departments=await Department.find()
        if(!departments) throw new InternalServerError('internal server error for getting department data')
        return departments
    }

}

export default UserRepository