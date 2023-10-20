import getEnvVariable from "./getEnvVariable"
getEnvVariable()
export default {
    apiKey: process.env.apiKey,
    MONGOURL: process.env.DBURL,
    passwordAccess: process.env.PASSWORD_ACCESS,
    passwordRefresh: process.env.PASSWORD_REFRESH,
    brevoEmail: process.env.BREVOEMAIL,
    key: process.env.KEY,
    S3_ACCESSKEY:process.env.S3_ACCESSKEY,
    S3_SECRET_ACCESSKEY:process.env.S3_SECRET_ACCESSKEY,
    S3_REGION:process.env.S3_REGION,
    S3_BUCKET:process.env.S3_BUCKET,
    EMAIL:process.env.EMAIL,
    PASSWORD:process.env.PASSWORD,
    STRIPE:process.env.STRIPE,
    ENDPOINT:process.env.ENDPOINT

}

module.exports = {
    apiKey: process.env.apiKey,
    MONGOURL: process.env.DBURL,
    passwordAccess: process.env.PASSWORD_ACCESS,
    passwordRefresh: process.env.PASSWORD_REFRESH,
    brevoEmail: process.env.BREVOEMAIL,
    key: process.env.KEY,
    S3_ACCESSKEY:process.env.S3_ACCESSKEY,
    S3_SECRET_ACCESSKEY:process.env.S3_SECRET_ACCESSKEY,
    S3_REGION:process.env.S3_REGION,
    S3_BUCKET:process.env.S3_BUCKET,
    EMAIL:process.env.EMAIL,
    PASSWORD:process.env.PASSWORD,
    STRIPE:process.env.STRIPE,
    ENDPOINT:process.env.ENDPOINT
}

