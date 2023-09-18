import { userInterface } from "../../models/user"

export type userAccessType = {
    _id: string,
    email: string,
    password: string
}
export interface RequestTypeRefresh extends Request {
    admin?: userInterface,
    encryptedToken?: string
}

export interface RequestType extends Request {
    admin?: userAccessType,
    encryptedToken?: string
}