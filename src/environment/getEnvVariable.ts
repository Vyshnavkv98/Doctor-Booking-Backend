
import dotenv from "dotenv";
import path from "path";

const getEnvVariable = () => {
    
  dotenv.config({ path:path.join(__dirname, '..', '.env') });
  
};

export default getEnvVariable
module.exports= getEnvVariable