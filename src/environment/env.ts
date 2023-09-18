import getEnvVariable from "./getEnvVariable"
getEnvVariable()
console.log('first');

console.log(process.env.PASSWORD_REFRESH,);

export default {
    apiKey: process.env.apiKey,
    mongoUrl: process.env.dbUrl,
    passwordAccess: process.env.PASSWORD_ACCESS,
    passwordRefresh: process.env.PASSWORD_REFRESH,
    brevoEmail: process.env.BREVOEMAIL,
    key: process.env.KEY,
    S3_ACCESSKEY:process.env.S3_ACCESSKEY,
    S3_SECRET_ACCESSKEY:process.env.S3_SECRET_ACCESSKEY,
    S3_REGION:process.env.S3_REGION,
    S3_BUCKET:process.env.S3_BUCKET,
    EMAIL:process.env.EMAIL,
    PASSWORD:process.env.PASSWORD

}

module.exports = {
    apiKey: process.env.apiKey,
    mongoUrl: process.env.dbUrl,
    passwordAccess: process.env.PASSWORD_ACCESS,
    passwordRefresh: process.env.PASSWORD_REFRESH,
    brevoEmail: process.env.BREVOEMAIL,
    key: process.env.KEY,
    S3_ACCESSKEY:process.env.S3_ACCESSKEY,
    S3_SECRET_ACCESSKEY:process.env.S3_SECRET_ACCESSKEY,
    S3_REGION:process.env.S3_REGION,
    S3_BUCKET:process.env.S3_BUCKET,
    EMAIL:process.env.EMAIL,
    PASSWORD:process.env.PASSWORD
}

