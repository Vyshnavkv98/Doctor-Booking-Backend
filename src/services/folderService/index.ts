import Folder from "../../models/folder";
import InternalServerError from "../../utils/InternalServerError";


class FolderService{
    uploadFolder = async(data: any) => {

        const folder = new Folder(data);
    
        await folder.save();

        if (!folder) throw new InternalServerError("Upload Folder Error");

        return folder;
    }

}
export default FolderService;