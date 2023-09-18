import multer from "multer";
import uuid from 'uuid'
import File from "../../models/files,";
import S3 from 'aws-sdk/clients/s3'
import env from "../../environment/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import AWS from 'aws-sdk'
import multers3 from 'multer-s3'
import { s3BucketIdType } from "aws-sdk/clients/workmailmessageflow";
import { error } from "console";

AWS.config.update({
  
    accessKeyId:env.S3_ACCESSKEY,
    secretAccessKey:env.S3_SECRET_ACCESSKEY,
    region:env.S3_REGION

})

const storage=multer.memoryStorage()

const upload=multer({storage})


 const s3:any=new AWS.S3()
const Bucket=env.S3_BUCKET as string

const bucketName=env.S3_BUCKET
const accessKeyId=env.S3_ACCESSKEY
const region=env.S3_BUCKET
const secretAccessKey=env.S3_SECRET_ACCESSKEY

// const s3=new AWS.S3({
//     credentials:{
//         accessKeyId:accessKeyId as string,
//         secretAccessKey:secretAccessKey as string,

//     },
//     region:region
// })

// const uploadWithMulter=()=>multer({
//     storage:multers3({
//         s3:s3,
//         bucket:bucketName as string,
//         metadata:function (req,file,cb){
//             cb(null,{fieldname:file.fieldname})
//         },
//         key:function(req,file,cb){
//             cb(null,file.originalname)
//         }
//     })
// }).array('s3Images',5)

// uploadToAws=(req,res)=>{
//     const upload=uploadWithMulter()
//     upload(req,res,err=>{
//         if(err){
//             console.log(err);
//             res.json({err,msg:'error while uploading'})
//             return
//         }
//         res.json({msg:'file uploaded successfully',files:req.files})
//     })
// }


export default upload