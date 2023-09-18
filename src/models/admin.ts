import mongoose from "mongoose";
import { Schema } from "zod";
import validator from "validator"
import { Document } from "mongoose";
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import env from "../environment/env"
import User, { userInterface } from "./user";



const adminSchema=new mongoose.Schema({
    firstName:
    {
        type:String,
        require:true
    },
   email:
   {
    type:String,
    required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value:any):any{
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    },
        password:{
            type:String,
            required:true,
            trim:true,
        },
        tokens:[{
            token: {
                type: String, 
                // required: true
            },
            uuid: {
                type: String,
                //required: true,
            },
            time: {
                type: Number,
                //required: true
            }
        }]
    });

    
    export interface adminInterface extends Document{
        _id?:string,
        fisrtName?:string,
        password:string,
        tokens?:any[],
        getEncryptionKey: () => Buffer | undefined,
        findByCreds:(email:string,password:string)=>Promise<adminInterface>,
        findUsers:()=>Promise<userInterface>,
        generateTempAuthToken:()=>Promise<any>,
        generateEncryptionKey:()=>Buffer|undefined,
        encryptToken:(tempToken: any, key: any, publicKey: any) => any;
        decryptToken:(encryptedToken: any, key: any, publicKey: any) => any;
        generateAuthToken: (uuid: string | undefined) => Promise<{accessToken: string, refreshToken: string}>
        
      

    }


    
    const maxAgeAccess =  60 * 1000 * 20 + (1000 * 60);
const maxAgeRefresh = 60 * 1000 * 60 * 24 * 30 + (1000 * 60);



adminSchema.statics.findByCreds = async(email: string, password: string) => {

    const admin = await Admin.findOne({email});
    console.log(admin,'adminData');
    
    
    if (!admin) {

        throw new Error("Admin not found")
    }

    let pass=admin.password

   

    
    const isMatch = await bcrypt.compare(password, pass);
    

    if (!isMatch) {
        throw new Error("Incorrect password");
    }

    return admin;
}

adminSchema.methods.findUsers=async()=>{
    const users=await User.find()
}

adminSchema.methods.toJSON = function() {

    const admin = this;

    const adminObject = admin.toObject();

    delete adminObject.password;
    delete adminObject.tokens;
    delete adminObject.tempTokens;
    delete adminObject.privateKey;
    delete adminObject.publicKey;

    return adminObject;
}

adminSchema.methods.generateAuthToken=async function(uuid: string | undefined){
  const iv=crypto.randomBytes(16)

  const admin=this;

  const date=new Date();
  const time=date.getTime()
  let passwordAccess=env.passwordAccess as string
  let passwordRefresh=env.passwordRefresh as string

  console.log(passwordAccess,passwordRefresh,'model 142');
  
 console.log(env,'env')
  const adminObj = {_id: admin._id, emailVerified: admin.emailVerified, email: admin.email}
  let accessToken=jwt.sign({admin:adminObj}, passwordAccess!, {expiresIn: maxAgeAccess.toString()})
  let refreshToken = jwt.sign({_id:admin._id.toString(), iv, time}, passwordRefresh!, {expiresIn: maxAgeRefresh.toString()});
console.log(accessToken,refreshToken,'tokens');

const encryptionKey='my-encryption-key'

  const encryptedToken = admin.encryptToken(refreshToken, encryptionKey, iv);



  uuid = uuid ? uuid : "unknown";

  await Admin.updateOne({_id: admin._id}, {$push: {"tokens": {token: encryptedToken, uuid, time}}})
  return {accessToken, refreshToken};
}
adminSchema.methods.encryptToken = function(token: string, key: string, iv: any) {

    iv = Buffer.from(iv, "hex")

    const TOKEN_CIPHER_KEY = crypto.createHash('sha256').update(key).digest();
    const cipher = crypto.createCipheriv('aes-256-cbc', TOKEN_CIPHER_KEY, iv);
    const encryptedText = cipher.update(token);

    return Buffer.concat([encryptedText, cipher.final()]).toString("hex");;
}

adminSchema.methods.decryptToken = function(encryptedToken: any, key: string, iv: any) {

    encryptedToken = Buffer.from(encryptedToken, "hex");
    iv = Buffer.from(iv, "hex")

    const TOKEN_CIPHER_KEY = crypto.createHash('sha256').update(key).digest();  
    const decipher = crypto.createDecipheriv('aes-256-cbc', TOKEN_CIPHER_KEY, iv)
    
    const tokenDecrypted = decipher.update(encryptedToken);

    return Buffer.concat([tokenDecrypted, decipher.final()]).toString();
}

adminSchema.methods.getEncryptionKey = function() {

    try {
        const admin = this;
        const adminPassword = admin.password;
        const masterPassword = env.key!;
        const iv = Buffer.from(admin.publicKey, "hex");

        const ADMIN_CIPHER_KEY = crypto.createHash('sha256').update(adminPassword).digest();
        const MASTER_CIPHER_KEY = crypto.createHash('sha256').update(masterPassword).digest();

        const unhexMasterText = Buffer.from("hex");
        const masterDecipher = crypto.createDecipheriv('aes-256-cbc', MASTER_CIPHER_KEY, iv)
        let masterDecrypted = masterDecipher.update(unhexMasterText);
        masterDecrypted = Buffer.concat([masterDecrypted, masterDecipher.final()])

        let decipher = crypto.createDecipheriv('aes-256-cbc', ADMIN_CIPHER_KEY, iv);
        let decrypted = decipher.update(masterDecrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
  console.log(decrypted,'decrypted');
  
        return decrypted;

    } catch (e) {

        console.log("Get Encryption Key Error", e);
    }
}


    const Admin=mongoose.model<adminInterface>('admin',adminSchema)

    export default Admin

    module.exports=Admin