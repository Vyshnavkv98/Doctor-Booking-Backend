import mongoose from "mongoose";
import { Binary, ObjectId } from "mongodb";
import { string } from "zod";
import { buffer } from "stream/consumers";


const fileSchema = new mongoose.Schema({
    length: {
        type: Number,
        required: true
    },
    chunkSize: {
        type: Number,

    },
    uploadDate: {
        type: Date,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },

    metaData: {
        type: {
            owner: {
                type: String,
                required: true
            },
            parent: {
                type: String,
                required: true
            },
            parentList: {
                type: String,
                required: true
            },
            isVideo: {
                type: Boolean,
                required: true
            },
            hasThumbnail: {
                type: Boolean,
                required: true
            },
            thumbnailID: String,
            size: {
                type: Number,
                required: true,
            },
            IV: {
                type:Buffer,
                required: true
            },
            linkType: String,
            link: String,
            filePath: String,
            s3ID: String,
            personalFile: Boolean,

        },
        required: true
    }
})

export interface fileInterface extends Document{
    length:number,
    chunkSize:number,
    uploadDate:string,
    fileName:string,
    lastErrorObject: {updatedExisting: any},
    metaData:{
        owner:string | ObjectId,
        parent:string,
        parentList:string
        isVideo:boolean,
        hasThumbnail:boolean,
        thumbnailID?:string ,
        size:number,
        IV: Buffer,
        linkType?: 'one' | 'public',
        link?: string,
        filePath?: string,
        s3ID?: string,
        personalFile? : boolean
    }
}

const File=mongoose.model<fileInterface>('files',fileSchema)
export default File
module.exports =File