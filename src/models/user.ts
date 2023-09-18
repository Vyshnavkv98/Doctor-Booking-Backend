import mongoose from "mongoose";
import { Schema, boolean } from "zod";
import validator from "validator"
import { Document } from "mongoose";
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import env from "../environment/env"

const userSchema = new mongoose.Schema({
    firstName:
    {
        type: String,
        require: true
    },
    lastName: {
        type: String
    },
    email:
    {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value: any): any {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    }, bloodGroup: {
        type: String,
    },
    address: {
        type: String,
    },

    phoneNumber: {
        type: String,
    },
    city: {
        type: String,
    },
    district: {
        type: String,
    },
    gender: {
        type: String,
    },
    profileImg:{
        type:String
    },
    password: {
        type: String,
        required: true,
        // trim:true,
    },
    tokens: [{
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
    }],
    emailVerified: {
        type: Boolean
    },
    privateKey: {
        type: String,
    },
    is_Blocked: {
        type: Boolean
    }


}, { timestamps: true })


export interface userInterface extends Document {
    _id?: string,
    fisrtName?: string,
    email?: string,
    lastName?: string,
    password: string,
    tokens?: any[],
    is_Blocked?: boolean,
    privateKey?: string,
    emailVerified?: boolean,
    bloodGroup?: String,
    address?: String,
    phoneNumber?: String,
    city?: String,
    district?: String,
    gender?: String,
    profileImg:string,
    getEncryptionKey: () => Buffer | undefined,
    findByCreds: (email: string, password: string) => Promise<userInterface>,
    generateTempAuthToken: () => Promise<any>,
    generateEncryptionKey: () => Buffer | undefined,
    encryptToken: (tempToken: any, key: any, publicKey: any) => any;
    decryptToken: (encryptedToken: any, key: any, publicKey: any) => any;
    generateAuthToken: (uuid: string | undefined) => Promise<{ accessToken: string, refreshToken: string }>



}


const maxAgeAccess = 60 * 1000 * 20 + (1000 * 60);
const maxAgeRefresh = 60 * 1000 * 60 * 24 * 30 + (1000 * 60);


userSchema.pre("save", async function (this: any, next: any) {

    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
})

userSchema.statics.findByCreds = async (email: string, password: string) => {

    const user = await User.findOne({ email });

    if (!user) {

        throw new Error("User not found")
    }

    let pass = user.password




    const isMatch = await bcrypt.compare(password, pass);


    if (!isMatch) {
        throw new Error("Incorrect password");
    }

    return user;
}

userSchema.methods.toJSON = function () {

    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.tempTokens;
    delete userObject.privateKey;
    delete userObject.publicKey;

    return userObject;
}

userSchema.methods.generateAuthToken = async function (uuid: string | undefined) {
    const iv = crypto.randomBytes(16)

    const user = this;

    const date = new Date();
    const time = date.getTime()
    let passwordAccess = env.passwordAccess as string
    let passwordRefresh = env.passwordRefresh as string

    const userObj = { _id: user._id, emailVerified: user.emailVerified, email: user.email }
    let accessToken = jwt.sign({ user: userObj }, passwordAccess!, { expiresIn: maxAgeAccess.toString() })
    let refreshToken = jwt.sign({ _id: user._id.toString(), iv, time }, passwordRefresh!, { expiresIn: maxAgeRefresh.toString() });
    console.log(accessToken, refreshToken, 'tokens');

    //   const encryptionKey = user.getEncryptionKey();
    const encryptionKey = 'my-encryption-key'

    const encryptedToken = user.encryptToken(refreshToken, encryptionKey, iv);



    uuid = uuid ? uuid : "unknown";

    await User.updateOne({ _id: user._id }, { $push: { "tokens": { token: encryptedToken, uuid, time } } })
    // console.log("saving user")
    // console.log("user saved")
    return { accessToken, refreshToken };
}

userSchema.methods.encryptToken = function (token: string, key: string, iv: any) {

    iv = Buffer.from(iv, "hex")

    const TOKEN_CIPHER_KEY = crypto.createHash('sha256').update(key).digest();
    const cipher = crypto.createCipheriv('aes-256-cbc', TOKEN_CIPHER_KEY, iv);
    const encryptedText = cipher.update(token);

    return Buffer.concat([encryptedText, cipher.final()]).toString("hex");;
}

userSchema.methods.decryptToken = function (encryptedToken: any, key: string, iv: any) {

    encryptedToken = Buffer.from(encryptedToken, "hex");
    iv = Buffer.from(iv, "hex")

    const TOKEN_CIPHER_KEY = crypto.createHash('sha256').update(key).digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', TOKEN_CIPHER_KEY, iv)

    const tokenDecrypted = decipher.update(encryptedToken);

    return Buffer.concat([tokenDecrypted, decipher.final()]).toString();
}

// userSchema.methods.generateEncryptionKey(){
//     const user=this;

// }

userSchema.methods.getEncryptionKey = function () {

    try {
        const user = this;
        const userPassword = user.password;
        // const masterEncryptedText = user.privateKey;
        const masterPassword = env.key!;
        const iv = Buffer.from(user.publicKey, "hex");

        const USER_CIPHER_KEY = crypto.createHash('sha256').update(userPassword).digest();
        const MASTER_CIPHER_KEY = crypto.createHash('sha256').update(masterPassword).digest();

        const unhexMasterText = Buffer.from("hex");
        const masterDecipher = crypto.createDecipheriv('aes-256-cbc', MASTER_CIPHER_KEY, iv)
        let masterDecrypted = masterDecipher.update(unhexMasterText);
        masterDecrypted = Buffer.concat([masterDecrypted, masterDecipher.final()])

        let decipher = crypto.createDecipheriv('aes-256-cbc', USER_CIPHER_KEY, iv);
        let decrypted = decipher.update(masterDecrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        console.log(decrypted, 'decrypted');

        return decrypted;

    } catch (e) {

        console.log("Get Encryption Key Error", e);
        // return undefined;
    }
}


const User = mongoose.model<userInterface>('user', userSchema)

export default User

module.exports = User

