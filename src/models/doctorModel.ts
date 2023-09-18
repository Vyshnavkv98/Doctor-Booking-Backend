import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { IDoctorModelInterface } from "./interface";
import bcrypt from 'bcrypt'
import crypto from "crypto"
import jwt from "jsonwebtoken"
import env from "../environment/env"
import { timeStamp } from "console";
import { string } from "zod";

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,

  },
  gender: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
  },
  address: {
    type: String,
  },
  contact: {
    type: Number,

  },
  password: {
    type: String,

  },
  department: {
    type: ObjectId,
  },
  qualification: {
    type: String,
  },
  city: {
    type: String,
  },
  RegisterNumber: {
    type: String,
  },
  RegisterFee: {
    type: Number,
  },
  RegistartionCouncil: {
    type: String,
  },
  RegistrationYear: {
    type: String,
  },
  Specialization: {
    type: String,
  },
  imgUrl:{
    type:String
  },
  isApproved: {
    type: String,
  },
  AvailableSlots: [
   {
    date:{
      type:String
    },
    slots:{
      type:Array
    }
   }
  ],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  image: {
    type: String,
  },
  AddressLine1:{
    type:String
  },
  AddressLine2:{
    type:String
  },
  documents: {
    type: Array,
  },
  videoConsultationSlots: [
    {
     date:{
       type:String,
     },
     slots:{
       type:Array
     }
    }
   ],
  token: {
    type: Array,
  },
  blockReason: {
    type: String
  },
  offline:{
    type:Boolean,
    default:true
  },
  chat:{
    type:Boolean,
    default:false
  },
  video:{
    type:Boolean,
    default:false
    
  },

}, { timestamps: true });


const maxAgeAccess = 60 * 1000 * 20 + (1000 * 60);
const maxAgeRefresh = 60 * 1000 * 60 * 24 * 30 + (1000 * 60);

doctorSchema.pre("save", async function (this: any, next: any) {

  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
})


doctorSchema.statics.findByCreds = async (email: string, password: string) => {

  const doctor = await Doctor.findOne({ email });

  if (!doctor) {

    throw new Error("Doctor not found")
  }

  let pass = doctor.password




  const isMatch = await bcrypt.compare(password, pass);


  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  return doctor;
}

doctorSchema.methods.findUsers = async () => {
  const Doctors = await Doctor.find()
}

doctorSchema.methods.toJSON = function () {

  const doctor = this;

  const doctorObject = doctor.toObject();

  delete doctorObject.password;
  delete doctorObject.tokens;
  delete doctorObject.tempTokens;
  delete doctorObject.privateKey;
  delete doctorObject.publicKey;

  return doctorObject;
}

doctorSchema.methods.generateAuthToken = async function (uuid: string | undefined) {
  const iv = crypto.randomBytes(16)

  const doctor = this;

  const date = new Date();
  const time = date.getTime()
  let passwordAccess = env.passwordAccess as string
  let passwordRefresh = env.passwordRefresh as string


  const doctorObj = { _id: doctor._id, emailVerified: doctor.emailVerified, email: doctor.email }
  let accessToken = jwt.sign({ doctor: doctorObj }, passwordAccess!, { expiresIn: maxAgeAccess.toString() })
  let refreshToken = jwt.sign({ _id: doctor._id.toString(), iv, time }, passwordRefresh!, { expiresIn: maxAgeRefresh.toString() });
  console.log(accessToken, refreshToken, 'tokens');

  const encryptionKey = 'my-encryption-key'

  const encryptedToken = doctor.encryptToken(refreshToken, encryptionKey, iv);



  uuid = uuid ? uuid : "unknown";

  await Doctor.updateOne({ _id: doctor._id }, { $push: { "tokens": { token: encryptedToken, uuid, time } } })
  return { accessToken, refreshToken };
}
doctorSchema.methods.encryptToken = function (token: string, key: string, iv: any) {

  iv = Buffer.from(iv, "hex")

  const TOKEN_CIPHER_KEY = crypto.createHash('sha256').update(key).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', TOKEN_CIPHER_KEY, iv);
  const encryptedText = cipher.update(token);

  return Buffer.concat([encryptedText, cipher.final()]).toString("hex");;
}

doctorSchema.methods.decryptToken = function (encryptedToken: any, key: string, iv: any) {

  encryptedToken = Buffer.from(encryptedToken, "hex");
  iv = Buffer.from(iv, "hex")

  const TOKEN_CIPHER_KEY = crypto.createHash('sha256').update(key).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', TOKEN_CIPHER_KEY, iv)

  const tokenDecrypted = decipher.update(encryptedToken);

  return Buffer.concat([tokenDecrypted, decipher.final()]).toString();
}

doctorSchema.methods.getEncryptionKey = function () {

  try {
    const doctor = this;
    const doctorPassword = doctor.password;
    const masterPassword = env.key!;
    const iv = Buffer.from(doctor.publicKey, "hex");

    const DOCTOR_CIPHER_KEY = crypto.createHash('sha256').update(doctorPassword).digest();
    const MASTER_CIPHER_KEY = crypto.createHash('sha256').update(masterPassword).digest();

    const unhexMasterText = Buffer.from("hex");
    const masterDecipher = crypto.createDecipheriv('aes-256-cbc', MASTER_CIPHER_KEY, iv)
    let masterDecrypted = masterDecipher.update(unhexMasterText);
    masterDecrypted = Buffer.concat([masterDecrypted, masterDecipher.final()])

    let decipher = crypto.createDecipheriv('aes-256-cbc', DOCTOR_CIPHER_KEY, iv);
    let decrypted = decipher.update(masterDecrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    console.log(decrypted, 'decrypted');

    return decrypted;

  } catch (e) {

    console.log("Get Encryption Key Error", e);
  }
}


export const Doctor = mongoose.model<IDoctorModelInterface>('doctors', doctorSchema)