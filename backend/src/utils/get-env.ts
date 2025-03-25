export const getEnv = (key : string, defaultValue : string = "") : string => {
    const value = process.env[key];

    if(value === undefined){
        if(defaultValue){
            return defaultValue;
        }
        else{
            throw Error(`Environment Variable ${key} is not setup`);
        }

    }



    return value;
}