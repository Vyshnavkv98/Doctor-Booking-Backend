import { userInterface } from "../../models/user";
import File from "../../models/files,";
import ForbiddenError from "../../utils/forbiddenError";
import videoChecker from "../../utils/videoChecker";
import chunkInterface from "./utils/chunkInterface";
import crypto from 'crypto'
import getBusboyData from "./utils/getBusboy";
import {Request} from 'express'
import uuid from 'uuid'
import env from "../../environment/env";
import awaitUploadStreamS3 from "./utils/awaitUploadStreamS3";





class S3Service implements chunkInterface {

    constructor() {

    }

    uploadFile = async( busboy: any, req: Request)=> {
console.log('first');

    //    const password = user.getEncryptionKey(); 
    const password='1234567'
     
        
        if (!password) throw new ForbiddenError("Invalid Encryption Key")
        console.log('2nd');
        const initVect = crypto.randomBytes(16);
        console.log('3rd');
        const CIPHER_KEY = crypto.createHash('sha256').update(password).digest()        
        console.log('4th');
        const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
        console.log('5th');
        const {file, filename, formData} = await getBusboyData(busboy);
        console.log(file, filename, formData,'file formdata filename rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
        

        const parent = formData.get("parent") || "/"
        const parentList = formData.get("parentList") || "/";
        const size = formData.get("size") || ""
        const personalFile = formData.get("personal-file") ? true : false;
        let hasThumbnail = false;
        let thumbnailID = ""
        const isVideo = videoChecker(filename)

        const randomS3ID = uuid.v4();

        const s3Data: any =  {};
        const bucketName = env.S3_BUCKET;

        let metadata: any = {
                // owner: user._id,
                parent,
                parentList,
                hasThumbnail,
                thumbnailID,
                isVideo,
                size,
                IV: initVect,
                s3ID: randomS3ID,
        }

       // if (personalFile) metadata = {...metadata, personalFile: true}

        const params = {
            Bucket: bucketName,
            Body : file.pipe(cipher),
            Key : randomS3ID
        };

        await awaitUploadStreamS3(params, personalFile, s3Data);

        const date = new Date();
        const encryptedFileSize = size;
        
        const currentFile = new File({
            filename,
            uploadDate: date.toISOString(),
            length: encryptedFileSize,
            metadata,
        })

        await currentFile.save();
       return currentFile
    }

}

export default S3Service