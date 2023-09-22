import DoctorController from "../controller/doctor/doctor";
import {Router} from 'express'

const doctorController=new DoctorController()
const router=Router()

router.get("/doctor",doctorController.getUser)
router.post("/doctor/login",doctorController.login)
router.post("/doctor/signup", doctorController.createUser);
router.post("/doctor/verfyotp", doctorController.verifyOtp);
router.post("/get-token", doctorController.getToken);
router.post("/logout",doctorController.logout)
router.post("/logoutAll",doctorController.logoutAll)
router.post("/verifydata",doctorController.doctorVerification)
router.post("/add-slots",doctorController.addAvailableSlots)
router.post("/add-videoslots",doctorController.addVideoAvailableSlots)
router.post("/get-slots",doctorController.getAvailableSlots)
router.get("/doctor-details",doctorController.getDoctor)
router.get("/get-departments",doctorController.getAllDepartment)
router.get("/get-appointments",doctorController.getAppointments)
router.post("/confirm-video-consultation-appointment",doctorController.confirmAppointment)


export default router