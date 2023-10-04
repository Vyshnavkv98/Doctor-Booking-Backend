
export interface ISlotInterface {
    doctorId: string,
    formattedDate: string,
    timeSlotsVideo: string[]

}

export interface IPaymentInterface {
    name: string,
    RegisterFee: number,

}

export interface IStatusType {
    status: string,
    id: string
}

export type PrescriptionType = {
    medicationName: string;
    dosage: string;
    frequency: string;
    instructions: string;
  };
  
 export type DiagnosisType = {
    diagnosis: string;
    notes: string;
    nextAppointment: string;
  };
  
  export type PrescriptionData = {
    prescription: PrescriptionType[];
    allPrescription: DiagnosisType;
    id:string
  };