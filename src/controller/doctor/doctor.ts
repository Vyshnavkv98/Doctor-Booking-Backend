import doctorServices from "../../services/doctorservices";
import { Request, Response } from "express"
import { IDoctorModelInterface } from "../../models/interface";
import NotFoundError from "../../utils/notFoundError";
import InternalServerError from "../../utils/InternalServerError";
import { randomUUID } from "crypto";
import { createLoginCookie } from "../../cookies/cookies";

const doctorProvider = new doctorServices()

type adminAccessType = {
    _id: string,
    emailVerified: boolean,
    email: string,
    doctor: boolean,
    botChecked: boolean,
    username: string,
}

interface RequestTypeRefresh extends Request {
    doctor?: IDoctorModelInterface,
    encryptedToken?: string
}

interface RequestType extends Request {
    doctor?: adminAccessType,
    encryptedToken?: string
}


class doctorController {

    constructor() {

    }

    createUser = async (req: RequestType, res: Response) => {
        try {
            await doctorProvider.createUser(req.body);
            res.status(201).send("register successful");
        } catch (e: any) {
            console.log("\nCreate User Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.message });
        }
    }
    verifyOtp = async (req: RequestType, res: Response) => {
        try {
            const { otp, email } = req.body
            await doctorProvider.verifyOtp(otp, email);
            res.status(201).send({ message: "registration success" });

        } catch (e: any) {
            console.log("\nverify otp:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.message });
        }
    }


    getUser = async (req: RequestType, res: Response) => {

        try {

            const user = req.doctor!;

            res.send(user)

        } catch (e: any) {

            console.log("\nGet User Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.message });
        }
    }

    login = async (req: Request, res: Response) => {

        try {
            console.log('login first');

            const currentUUID = req.headers.uuid as string;
            console.log(currentUUID, 'currentuuid');

            const body = req.body
            const { doctor, accessToken, refreshToken } = await doctorProvider.login(body, currentUUID);
            if (!doctor) {
                res.status(401).send(('email or password incorrect'))
            }

            res.status(200).send({ doctor, accessToken, refreshToken, message: 'login success' });


        } catch (e: any) {
            console.log("\nDoctor Login  Route Error:", e.message);

            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.message });
        }

    }
    getToken = async (req: RequestTypeRefresh, res: Response) => {

        try {

            const user = req.doctor;

            if (!user) throw new NotFoundError("User Not Found");

            const currentUUID = req.headers.uuid as string;

            const { accessToken, refreshToken } = await user.generateAuthToken(currentUUID);

            if (!accessToken || !refreshToken) throw new InternalServerError("User/Access/Refresh Token Missing");

            createLoginCookie(res, accessToken, refreshToken);

            res.status(201).send();

        } catch (e: any) {

            console.log("\nGet Refresh Token User Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.message });
        }
    }

    logout = async (req: RequestType, res: Response) => {
        try {
            console.log(req.doctor, 'loginpage   cannot find user');
            if (!req.doctor) return;

            const userid = req.doctor._id;


            const refreshToken = req.cookies["refresh-token"];
            console.log(userid);

            await doctorProvider.logout(userid, refreshToken);
            // createLogoutCookie(res)
            res.send("logout successfully");
        } catch (e: any) {
            console.log("\nLogout User Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            // createLogoutCookie(res);
            res.status(code).send({ message: e.message });
        }
    }
    logoutAll = async (req: RequestType, res: Response) => {
        console.log(req.doctor, 'logout');

        if (!req.doctor) return;

        try {

            const userid = req.doctor._id;
            console.log(userid, '131');


            await doctorProvider.logoutAll(userid);


            res.status(204).send();

        } catch (e: any) {

            console.log("\nLogout All Doctor Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.message });
        }
    }


    doctorVerification = async (req: RequestType, res: Response) => {
        try {
            const doctorData = req.body
            const docData = await doctorProvider.verification(doctorData);

            res.status(201).send({ doctor: docData, message: "Doctor verification data uploaded successfully" });

        } catch (e: any) {
            console.log("\n doctorVerification All Doctor Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.message });
        }
    }
    addAvailableSlots = async (req: RequestType, res: Response) => {
            try {
                const slotsAndDate=req.body
                
                const updatedSlotData=await doctorProvider.addSlots(slotsAndDate)
                
                res.status(201).send({slotData:updatedSlotData, message: "Slots selected successfully" });

                
            } catch (e:any) {
                console.log("\n doctor add Slot Doctor Route Error:", e.message);
                const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
                res.status(code).send({ message: e.message });
            }
    }
    addVideoAvailableSlots = async (req: RequestType, res: Response) => {
            try {
                const slotsAndDate=req.body
                console.log(req.body);
                
                
                const updatedSlotData=await doctorProvider.addVideoConsultationSlots(slotsAndDate)
                
              if(updatedSlotData) res.status(201).send({slotData:updatedSlotData, message: "Slots selected successfully" });
              else res.status(500).send({slotData:updatedSlotData, message: "internal server error" });

                
            } catch (e:any) {
                console.log("\n doctor add Slot Doctor Route Error:", e.message);
                const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
                res.status(code).send({ message: e.message });
            }
    }
    getAvailableSlots= async (req: RequestType, res: Response) => {

        try {
            const {doctorId}=req.body
            const slotsData=await doctorProvider.getSlots(doctorId)
            
            res.status(200).send({slotsData:slotsData,message:'slot data'})
        } catch (e:any) {
            console.log("\n doctor get Slot Doctor Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.message });
        }
    }
    getDoctor= async (req: RequestType, res: Response) => {

        try {
            const {doctorId}=req.body
            
            const doctorData=await doctorProvider.getDoctordata(doctorId)
            
            res.status(200).send({doctorData:doctorData,message:'slot data'})
        } catch (e:any) {
            console.log("\n doctor get Slot Doctor Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.message });
        }
    }
    getAllDepartment = async (req:RequestType, res: Response) => {
        try {
            const departmentData = await doctorProvider.getDepartments()
            if(!departmentData) throw new  NotFoundError('departments not found')
            res.status(200).send({departments:departmentData})

        } catch (e: any) {
            console.log("\nLogout All User Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.meesage })
        }

    }

    getAppointments=async(req:RequestType,res:Response)=>{
      try {
        const appointmentDetails=await doctorProvider.getAppointments()
        if(!appointmentDetails) throw new  NotFoundError('appointments not found')
        res.status(200).send({appointments:appointmentDetails})
        
      } catch (e:any) {
        console.log("\n getappointment All Doctor Route Error:", e.message);
        const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
        res.status(code).send({ message: e.meesage })
      }
    }
    getAppointmentsCompleted=async(req:RequestType,res:Response)=>{
      try {
        const appointmentDetails=await doctorProvider.getAppointmentsCompleted()
        if(!appointmentDetails) throw new  NotFoundError('appointments not found')
        res.status(200).send({appointments:appointmentDetails})
        
      } catch (e:any) {
        console.log("\n getappointment All Doctor Route Error:", e.message);
        const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
        res.status(code).send({ message: e.meesage })
      }
    }
    confirmAppointment=async(req:RequestType,res:Response)=>{
      try {
        console.log(req.body);
        
        const appointmentConfrim=await doctorProvider.confirmAppointment(req.body)
        if(!appointmentConfrim) throw new  NotFoundError('appointments not found')
        res.status(200).send({appointments:appointmentConfrim,confirmationStatus:'true'})
        
      } catch (e:any) {
        console.log("\n getappointment All Doctor Route Error:", e.message);
        const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
        res.status(code).send({ message: e.meesage })
      }
    }
    completeAppointment=async(req:RequestType,res:Response)=>{
      try {
         const{id}=req.body
        const appointmentComplete=await doctorProvider.completeAppointment(id)
        if(!appointmentComplete) throw new  NotFoundError('appointments not found')
        res.status(200).send({message:'videoConsultationCompleted'})
        
      } catch (e:any) {
        console.log("\n getappointment All Doctor Route Error:", e.message);
        const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
        res.status(code).send({ message: e.meesage })
      }
    }

    addPrescription=async(req:RequestType,res:Response)=>{
        try {
            const appointmentData=await doctorProvider.addPrescription(req.body)
            if(!appointmentData) throw new  NotFoundError('appointments not found')
            res.status(200).send({message:'prescription added successfully',appointment:appointmentData})
        } catch (e:any) {
            console.log("\n addPrescription All Doctor Route Error:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send({ message: e.meesage })
        }
    }


}

export default doctorController;