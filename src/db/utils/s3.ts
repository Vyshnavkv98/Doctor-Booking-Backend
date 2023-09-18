import AWS from "aws-sdk";
import multer from "multer";
import multers3 from "multer-s3";
import env from "../../environment/env";
import {S3Client} from "@aws-sdk/client-s3"

AWS.config.update({
    accessKeyId: env.S3_ACCESSKEY,
    secretAccessKey: env.S3_SECRET_ACCESSKEY,
    region: env.S3_REGION
});

// const s3Config = new S3Client({
//     region: 'us-west-1',
//     credentials:{
//        accessKeyId:env.S3_ACCESSKEY as string,
//        secretAccessKey:env.S3_SECRET_ACCESSKEY as string
//    }
//  })

const bucket = env.S3_BUCKET as string;
const s3 = new AWS.S3();

// const upload = multer({
//     storage: multers3({
//         bucket: bucket,
//         s3: s3Config,
//         acl: 'public-read',
//         key: (req, file, cb) => {
//             cb(null, file.originalname);
//         }
//     })
// });






export default s3;

module.exports= s3;
