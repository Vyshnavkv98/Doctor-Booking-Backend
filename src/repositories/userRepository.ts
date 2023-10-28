import { RequestType, userAccessType } from "../controller/interfaces.ts";
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
        const isREgister = await User.findOne({ email: email })
        console.log(isREgister);
        
        return isREgister
    }
    async getDoctors() {
        const doctors = await Doctor.find({video:true})
        return doctors
    }

    async addOfflineAppointmentData(appointmentData:IAppointmentDataType){

        const{name,email,reason,fee,mobile,date,time,userId,doctorId,doctorFee,videoConsult}=appointmentData
        console.log(appointmentData)
let addedAppointment
if(!videoConsult){        
         addedAppointment= new Appointment({
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
    }else{
        addedAppointment= new Appointment({
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
            consultationMode:'videocall'
        })
    }
        await addedAppointment.save()
        if(addedAppointment) return addedAppointment
        else throw new Error('Add appointment failed')
        
    }

    async getDepartments(){
        const departments=await Department.find()
        if(!departments) throw new InternalServerError('internal server error for getting department data')
        return departments
    }
    async getAllVideoAppointments(req:RequestType) {
        const userId=req.user
        const id=userId?._id?.toString()
        
        const departments = await (Appointment.find({ consultationMode: 'videocall',user:id }).populate('user').sort({ createdAt: -1 }))
        if (!departments) throw new InternalServerError('internal server error for getting Appointment data')
        console.log(departments,'deppppspspps');
        
        return departments
    
      }
    async getAllVideocallAppointments(req:RequestType) {
        const userId=req.user
        const id=userId?._id?.toString()
        
        const departments = await (Appointment.find({ consultationMode: 'offline',user:id }).populate('doctor').sort({ createdAt: -1 }))
        if (!departments) throw new InternalServerError('internal server error for getting Appointment data')
        return departments
    
      }

   async updateCancelAppointment(appointmentId:string){
    const appointmentData=await Appointment.findByIdAndUpdate(appointmentId,{
        status:'Cancelled'
    })
    if(appointmentData) return appointmentData
    else throw new InternalServerError('internal server error for cancel appointment')
   }

}

export default UserRepository