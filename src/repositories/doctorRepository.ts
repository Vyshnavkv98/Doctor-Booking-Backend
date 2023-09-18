import { IDoctorModelInterface } from "../models/interface";
import { Doctor } from "../models/doctorModel";
import NotFoundError from "../utils/notFoundError";
import { useStderr } from "../../jest.config";
import { doctorCache } from '../interfaces/doctorCache'
import { ISlotInterface } from "../interfaces/doctorSlot";
import { Department } from "../models/departments";
import InternalServerError from "../utils/InternalServerError";




class DoctorRepository {
  constructor() {

  }


  async getDoctorServices(userId: String) {
    console.log(userId);

    const doctors = await Doctor.findById(userId);
    if (!doctors) throw new NotFoundError("Could Not Find doctor");
    return doctors;
  }
  async updateDoctorData(doctorData: doctorCache) {

    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorData?._id,
      {
        Specialization: doctorData?.specialization,
        gender: doctorData?.gender,
        city: doctorData?.city,
        RegisterFee: doctorData?.RegisterFee,
        RegistartionCouncil: doctorData?.registrationCouncil,
        RegistrationYear: doctorData?.registrationYear,
        RegisterNumber: doctorData?.registerNumber,
        imgUrl: doctorData?.imgUrl,
        image: doctorData?.image,
        AddressLine1:doctorData?.AddressLine1,
        AddressLine2:doctorData?.AddressLine2,
        offline:doctorData.offline,
        chat:doctorData.chat,
        video:doctorData.video,
        videoConsultationSlots:[]

      },
      { new: true })
      
    return updatedDoctor
  }

  async findSlotDetails(slotData: ISlotInterface) {
    const slotDetails = await Doctor.findById(slotData?.doctorId)
    if (!slotDetails) {
      throw new NotFoundError("Could Not Find doctor");
    }
    else {
      return slotDetails
    }
  }

  async updateSlot(slotData: ISlotInterface, indexToUpdate: number) {
    console.log(slotData, '44 doc repo');
    const slots = slotData.timeSlots
    const doctorData = await Doctor.findById(slotData.doctorId)
    if (doctorData?.AvailableSlots) {
      doctorData.AvailableSlots[indexToUpdate].slots = slots;
      const updatedDoctor = await doctorData.save();
      return updatedDoctor;
    } else {
      throw new Error(`Doctor with ID ${slotData.doctorId} not found or AvailableSlots is undefined.`);
    }


  }
  async addNewSlot(slotData: ISlotInterface) {
    const updatedSlots = await Doctor.findById(slotData?.doctorId)
    if (!updatedSlots) {
      throw new Error(`Doctor with ID ${slotData?.doctorId} not found.`);
    }

    // Push the new slot data into the AvailableSlots array
    if (updatedSlots !== undefined) {
      updatedSlots.AvailableSlots?.push({ date: slotData.formattedDate, slots: slotData.timeSlots })
    }

    // Save the updated doctor document
    const updatedDoctor = await updatedSlots.save();

    return updatedDoctor;
  }

  async getDoctorSlots(id:string) {
    const doctor = Doctor.findById({_id:id})
    return doctor
  }

  async getDepartments(){
    const departments=await Department.find()
    if(!departments) throw new InternalServerError('internal server error for getting department data')
    return departments
}


}


export default DoctorRepository;