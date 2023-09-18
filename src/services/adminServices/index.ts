import Admin, { adminInterface } from "../../models/admin"
import NotFoundError from "../../utils/notFoundError";
import env from "../../environment/env";
import jwt from "jsonwebtoken";
import admin from "../../models/admin"
import AdminRepository from "../../repositories/adminRepository";
import DepartmentRepository from "../../repositories/DepartmentRepository";
import { IDepartment } from "../../models/interface";

const adminRepository = new AdminRepository()
const departmentRepository=new DepartmentRepository()


type adminDataType = {
    email: string,
    password: string
};

type jwtType = {
    iv: Buffer,
    _id: string
};

const unknownadminType = Admin as unknown;
const adminStaticType = unknownadminType as {
    findByCreds: (email: string, password: string) => Promise<adminInterface>;
};

class AdminServices {
    constructor() {
    }



    login = async (adminData: adminDataType, uuid: string | undefined) => {



        const email = adminData.email;
        const password = adminData.password;

        const admin = await adminStaticType.findByCreds(email, password);

        if (!admin) throw new NotFoundError("Cannot Find User");

        const { accessToken, refreshToken } = await admin.generateAuthToken(uuid);
        console.log(accessToken, refreshToken, 'service');


        if (!accessToken || !refreshToken) throw new NotFoundError("Login User Not Found Error");



        return { admin, accessToken, refreshToken }
    }

    logout = async (userid: string, refreshToken: string) => {

        const admin = await Admin.findById(userid)
        if (!admin) throw new NotFoundError("Could Not Find User");

        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, env.passwordRefresh!) as jwtType
            const encryptionkey = 'my-encryption-key'
            const encryptedToken = admin.encryptToken(refreshToken, encryptionkey, decoded.iv)


            for (let i = 0; i < admin.tokens!.length; i++) {

                const currentEncryptedToken = admin.tokens![i].token;

                if (currentEncryptedToken === encryptedToken) {

                    admin.tokens!.splice(i, 1);
                    console.log("logut from service");

                    await admin.save();
                    break;
                }
            }
        }
        await admin.save()
    }

    logoutAll = async (userid: string) => {

        const admin = await Admin.findById(userid);
        console.log(admin, 'logoutall');

        if (!admin) throw new NotFoundError("Could Not Find admin");
        admin.tokens = [];
        await admin.save();
    }
    getDocData = async () => {
        const doctorDetails = await adminRepository.getDoctors()
        return doctorDetails
    }
    addNewDepartment=async(departmentData:IDepartment)=>{
        const departmentDetails=await departmentRepository.addDepartment(departmentData)
        if (departmentDetails==null) throw new NotFoundError("Could Not Find the department");
        return departmentDetails
    }

    getAllDepartmentDetail=async()=>{
        const departmentDetails=await departmentRepository.getDepartments()
        return departmentDetails
    }
}
export default AdminServices;