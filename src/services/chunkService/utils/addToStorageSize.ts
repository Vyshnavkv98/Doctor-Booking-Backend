
import { userInterface } from "../../../models/user";

const addToStoageSize = async(user: userInterface, size: number, isPersonalFile: boolean) => {

    await user.save();
}

export default addToStoageSize;