import { userInterface } from "../../models/user";
import chunkInterface from "./utils/chunkInterface";
import { Request } from 'express'
import ForbiddenError from "../../utils/forbiddenError";
import { GridFSBucketWriteStream } from "mongodb";
import crypto from 'crypto'
import getBusboyData from "./utils/getBusboy";
import videoChecker from "../../utils/videoChecker";
import mongoose from "mongoose";
import { fileInterface } from "../../models/files,";
import awaitUploadStream from "./utils/awaitUpload";
import imageChecker from "../../utils/imageChecker";
import { env } from "process";
import uuid from 'uuid'

const conn = mongoose.connection;

class MongoService implements chunkInterface {

    constructor() {

    }
    uploadFile = async(user: userInterface, busboy: any, req: Request) => {

        const password = user.getEncryptionKey(); 

        if (!password) throw new ForbiddenError("Invalid Encryption Key")

        const initVect = crypto.randomBytes(16);

        const CIPHER_KEY = crypto.createHash('sha256').update(password).digest()        

        const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);

        const {file, filename, formData} = await getBusboyData(busboy);

        const parent = formData.get("parent") || "/"
        const parentList = formData.get("parentList") || "/";
        const size = formData.get("size") || ""
        const personalFile = formData.get("personal-file") ? true : false;
        let hasThumbnail = false;
        let thumbnailID = ""
        const isVideo = videoChecker(filename)

        const randomS3ID = uuid.v4();

        const s3Data: any =  {};
        const bucketName = env.s3Bucket;

        let metadata: any = {
                owner: user._id,
                parent,
                parentList,
                hasThumbnail,
                thumbnailID,
                isVideo,
                size,
                IV: initVect,
                s3ID: randomS3ID,
        }

        if (personalFile) metadata = {...metadata, personalFile: true}

        bucketStream = bucket.openUploadStream(filename, { metadata });

        const allStreamsToErrorCatch = [file, cipher, bucketStream];

       // const finishedFile = await awaitUploadStream(file.pipe(cipher), bucketStream, req, allStreamsToErrorCatch) as fileInterface;

        // await addToStoageSize(user, size, personalFile);

        const imageCheck = imageChecker(filename);

        if (filename.length < 15728640 && imageCheck) {

            //const updatedFile = await createThumbnailAny(finishedFile, filename, user);

            return file;

        } else {

            return file
        }
    }
}

export default MongoService;