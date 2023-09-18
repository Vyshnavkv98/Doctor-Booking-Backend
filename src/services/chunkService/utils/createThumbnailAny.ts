// import { env } from "process";
// import { fileInterface } from "../../../models/files,";
// import { userInterface } from "../../../models/user";



// const createThumnailAny = async(currentFile: fileInterface, filename: string, user: userInterface) => {

//     if (currentFile.metaData.personalFile || env.dbType === "s3") {

//         return await createThumbnailS3(currentFile, filename, user);

//     } else if (env.dbType === "mongo") {

//         return await createThumbnailMongo(currentFile, filename, user);
    
//     } else {

//         return await createThumbnailFilesystem(currentFile, filename, user);
//     }

// }

// export default createThumnailAny;