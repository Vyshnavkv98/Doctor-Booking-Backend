import NotAuthorizedError from "../utils";
import NotFoundError from "../../utils/notFoundError";
import env from "../../environment/env";
import { Jwt } from "jsonwebtoken";
import { fileInterface } from "../../models/files,";
import { userInterface } from "../../models/user";

type userAccessType={
    _id:string,
    emailVerified:boolean,
    email:string,

}