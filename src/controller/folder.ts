import { Request, Response } from "express"
import { ChunkServiceType } from "./file/interface";
import FolderService from "../services/folderService";

const folderService = new FolderService();

class folderController {
    chunkService: ChunkServiceType;

    constructor(chunkService: ChunkServiceType) {

        this.chunkService = chunkService;
    }

    uploadFolder = async (req: Request, res: Response) => {

        try {

            const data = req.body
            const folder = await folderService.uploadFolder(data)
            res.send(folder)



        } catch (e: any) {
            console.log("\nUpload Folder Error Folder Route:", e.message);
            const code = !e.code ? 500 : e.code >= 400 && e.code <= 599 ? e.code : 500;
            res.status(code).send();
        }
    }



}

export default folderController