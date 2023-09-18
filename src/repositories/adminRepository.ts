
import User from "../models/user";
import { Doctor } from "../models/doctorModel";
import { DoctorBlockType, DoctorVerifyType, userBlockType } from "../interfaces/userBlock";
import NotFoundError from "../utils/notFoundError";



class AdminRepository {
  constructor() {

  }

  async blockUser(userData:userBlockType){
    const updateUser=await User.findByIdAndUpdate(userData?._id,{
      is_Blocked:userData?.blockStatus
    },{new:true});
    console.log(updateUser,'updateuser');
    
    return updateUser
  }
  getDoctors=async()=>{
    const docDetails=await Doctor.find()
    if (!docDetails) throw new NotFoundError("Could Not Find doctors");
    return docDetails
   }
   async blockDoctor(doctorData:DoctorBlockType){
    const updateDoctor=await Doctor.findByIdAndUpdate(doctorData?._id,{
      isBlocked:doctorData?.blockStatus
    },{new:true});
    
    return updateDoctor
  }
   async verifyDoctor(doctorData:DoctorVerifyType){
    const updateDoctor=await Doctor.findByIdAndUpdate(doctorData?._id,{
      isVerified:doctorData?.isVerified
    },{new:true});
    console.log(updateDoctor,'updateuser');
    
    return updateDoctor
  }
 
}

export default AdminRepository;