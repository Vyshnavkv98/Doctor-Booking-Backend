import { Request, Response } from "express";
import { IRequestType } from "./interface";
import Busboy from "busboy";
import { ChunkServiceType } from "./interface";
import uuid from "uuid";
import { S3 } from 'aws-sdk'
import env from "../../environment/env";
import { S3Client } from "@aws-sdk/client-s3";

import AWS from 'aws-sdk'
import multer from "multer";
import multers3 from 'multer-s3'
import { s3BucketIdType } from "aws-sdk/clients/workmailmessageflow";
import { any } from "zod";



class fileController {

    chunkService: ChunkServiceType;

    constructor(chunkService: ChunkServiceType) {

        this.chunkService = chunkService;
    }

    uploadFile = async (req: IRequestType, res: Response) => {

        // if (!req.user) {

        //     return
        // }
        try {


            // const user = req.user;
           //  const busboy = req.busboy
             // req.pipe(busboy)

            // const filee = await this.chunkService.uploadFile( busboy, req)
           //  console.log(filee);
             

            // res.send(file);

            // req.pipe(busboy);
            console.log(req.files,'ffffffiiiiiiiiiilllllllllllleeeeeeeeeee');
            const BucketName=env.S3_BUCKET
            const s3=new AWS.S3()
            const file=req.files
            
            if (req.files && Array.isArray(req.files)) {
                const uploadPromises = req.files.map((file: Express.Multer.File) => {
                    const uploadParams: AWS.S3.PutObjectRequest = {
                        Bucket: BucketName as string,
                        Key: file.originalname,
                        Body: file.buffer
                    };
                    return s3.upload(uploadParams).promise();

                });
                Promise.all(uploadPromises)
                .then((data:any)=>{
                    data.forEach((element:any) => {
                        console.log('upload successfull');
                        
                    });
                })
            
            }

            res.send(file)

            

        } catch (e: any) {
            console.log("\nUploading File Error File Route:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.writeHead(code, { 'Connection': 'close' })
            res.end();

        }

    }

    getFile=async(req:IRequestType,res:Response)=>{
        try {

            const s3=new AWS.S3()
            const BucketName=env.S3_BUCKET as string
            let r=s3.listObjectsV2({Bucket:BucketName}).promise();
            let x=(await r).Contents?.map((item)=>item)
    
            res.send(x)
            
        } catch (e:any) {
            console.log("\nUploading File Error File Route:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.writeHead(code, { 'Connection': 'close' })
            res.end();
        }
      
    }


}





export default fileController