import { Department } from "../models/departments"
import { IDepartment } from "../models/interface"

class DepartmentRepository{
    constructor(){

    }
    addDepartment=async(departmentDetails:IDepartment)=>{
      const depName=departmentDetails.departmentName
      
      const isExist=await Department.find({departmentName:depName})

      if(isExist.length!==0){
        
        return new Error ('department details already exist')
      }
      
        const department=await new Department({
            departmentName:departmentDetails.departmentName,
            departmentHead:departmentDetails.departmentHead,
            departmentImg:departmentDetails.departmentImg,
            status:departmentDetails.status
        })
        await department.save()
console.log(department);

        return department

    }
   async getDepartments(){
      const departments=await Department.find()
      return departments
   }
}
export default DepartmentRepository