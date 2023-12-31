import { IDoctorModelInterface } from "../models/interface";
import { Doctor } from "../models/doctorModel";
import NotFoundError from "../utils/notFoundError";
import { useStderr } from "../../jest.config";
import { doctorCache } from '../interfaces/doctorCache'
import { ISlotInterface, ISlotOfflineInterface, IStatusType, PrescriptionData, } from "../interfaces/doctorSlot";
import { Department } from "../models/departments";
import InternalServerError from "../utils/InternalServerError";
import { Appointment } from "../models/appointments";




class DoctorRepository {
  constructor() {

  }


  async getDoctorServices(userId: String) {

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
        AddressLine1: doctorData?.AddressLine1,
        AddressLine2: doctorData?.AddressLine2,
        offline: doctorData.offline,
        chat: doctorData.chat,
        video: doctorData.video,
        videoConsultationSlots: []

      },
      { new: true })

    return updatedDoctor
  }

  async findSlotDetails(slotData: ISlotOfflineInterface) {
    const slotDetails = await Doctor.findById(slotData?.doctorId)
    if (!slotDetails) {
      throw new NotFoundError("Could Not Find doctor");
    }
    else {
      return slotDetails
    }
  }
  async findVideoConsultationSlotDetails(slotData: ISlotInterface) {
    const slotDetails = await Doctor.findById(slotData?.doctorId)
    if (!slotDetails) {
      throw new NotFoundError("Could Not Find doctor");
    }
    else {
      return slotDetails
    }
  }

  async updateSlot(slotData: ISlotOfflineInterface, indexToUpdate: number) {
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
  async addNewSlot(slotData: ISlotOfflineInterface) {
    const updatedSlots = await Doctor.findById(slotData?.doctorId)
    if (!updatedSlots) {
      throw new Error(`Doctor with ID ${slotData?.doctorId} not found.`);
    }

    // Push the new slot data into the AvailableSlots array
    if (updatedSlots !== undefined) {
      console.log(slotData.timeSlots, 'slots');

      updatedSlots.AvailableSlots?.push({ date: slotData.formattedDate, slots: slotData.timeSlots })
    }

    // Save the updated doctor document
    const updatedDoctor = await updatedSlots.save();

    return updatedDoctor;
  }

  async updateVideoConsultationSlot(slotData: ISlotInterface, indexToUpdate: number) {
    const slots = slotData.timeSlotsVideo
    console.log(slotData.doctorId);
    
    const doctorData = await Doctor.findById(slotData.doctorId)
    if (doctorData?.videoConsultationSlots) {
      doctorData.videoConsultationSlots[indexToUpdate].slots = slots;
      const updatedDoctor = await doctorData.save();
      console.log(updatedDoctor,'baaaaackkkk');
      
      return updatedDoctor;
    } else {
      throw new Error(`Doctor with ID ${slotData.doctorId} not found or AvailableSlots is undefined.`);
    }


  }

  async addNewVideoConsultationSlot(slotData: ISlotInterface) {
    const updatedSlots = await Doctor.findById(slotData?.doctorId)
    console.log(updatedSlots,'addd new videoslot');

    if (!updatedSlots) {
      throw new Error(`Doctor with ID ${slotData?.doctorId} not found.`);
    }

    // Push the new slot data into the AvailableSlots array
    if (updatedSlots !== undefined) {
      console.log(slotData, 'from add')
      updatedSlots.videoConsultationSlots?.push({ date: slotData.formattedDate, slots: slotData.timeSlotsVideo })
    }

    // Save the updated doctor document
    const updatedDoctor = await updatedSlots.save();

    return updatedDoctor;
  }

  async getDoctorSlots(id: string) {
    const doctor = Doctor.findById({ _id: id })
    return doctor
  }

  async getDepartments() {
    const departments = await Department.find()
    if (!departments) throw new InternalServerError('internal server error for getting department data')
    return departments
  }

  async getAllVideoAppointments() {
    const departments = await (Appointment.find({ consultationMode: 'videocall' }).sort({ createdAt: -1 }))
    if (!departments) throw new InternalServerError('internal server error for getting Appointment data')
    console.log(departments);
    
    return departments

  }
  async getAllAppointmentsCompleted() {
    const departments = await (Appointment.find({ status: 'completed' }).populate('user').sort({ createdAt: -1 }))
    if (!departments) throw new InternalServerError('internal server error for getting Appointment data')
    console.log(departments);
    
    return departments

  }

  async appointmentConfirm(status: IStatusType) {


    const updatedAppointment = await Appointment.findByIdAndUpdate(status.id, {
      status: status?.status
    }, { new: true })
    console.log(updatedAppointment, 'from repoo');
    if (!updatedAppointment) throw new InternalServerError('internal server error for getting Appointment data')
    return updatedAppointment

  }
  async updateVideoAppointmentComplete(id: string) {


    const updatedAppointment = await Appointment.findByIdAndUpdate(id, {
      status: 'completed'
    }, { new: true })
    console.log(updatedAppointment, 'from repoo');
    if (!updatedAppointment) throw new InternalServerError('internal server error for getting Appointment data')
    return updatedAppointment

  }

  async addPresctionData(prescriptionData: PrescriptionData) {
    console.log(prescriptionData, 'from repoooooooo presc');
    const data = prescriptionData?.allPrescription

    const updatedData = [
      prescriptionData?.allPrescription,
      prescriptionData?.prescription,

    ]


    console.log(updatedData, 'update');



    const updatedAppointment = await Appointment.findByIdAndUpdate(prescriptionData.id,
      {
        $set: {
          prescription: prescriptionData?.allPrescription,
          prescriptionNotes: prescriptionData.prescription?.notes,
          diagnosis: prescriptionData.prescription?.diagnosis,
          nextAppointment: prescriptionData.prescription?.nextAppointment,

        }
      }
      , { new: true })
    console.log(updatedAppointment);

    return updatedAppointment
  }


}


export default DoctorRepository;