import s3 from "../../../db/utils/s3"
const awaitUploadStreamS3 = (params: any, personalFile: boolean, s3Data: {id: string, key: string, bucket: string}) => {

    return new Promise((resolve, reject) => {

        

            s3.upload(params, (err: any, data: any) => {

                if (err) {
                    console.log("Amazon upload err", err)
                    reject("Amazon upload error");
                }
    
                resolve('successfull');
            })
        
    })
}

export default awaitUploadStreamS3;