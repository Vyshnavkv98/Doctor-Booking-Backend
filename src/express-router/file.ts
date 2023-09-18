import FileController from "../controller/file/file";
import {Router} from 'express'
import S3Service from "../services/chunkService/s3service";
import authFullUser from "../middleware/authFullUser";
import chunkInterface from "../services/chunkService/utils/chunkInterface";
import upload from "../services/multerService/multer";

let fileController:FileController;
let chunkService: chunkInterface;


const router=Router()


const s3service = new S3Service();

 chunkService=s3service
fileController=new FileController(s3service)

router.post("/upload",upload.array("files"),fileController.uploadFile);
router.get("/list",fileController.getFile);

export default router