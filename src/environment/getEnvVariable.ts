
import dotenv from "dotenv";
import path from "path";

const getEnvVariable = () => {
    console.log('hhhhhhhhhhhh');
    
  dotenv.config({ path:path.join(__dirname, '..', '.env') });
  console.log(process.env.dbUrl);
  
};

export default getEnvVariable
module.exports= getEnvVariable