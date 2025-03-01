export const isDevelopmentInstance = () => {
    return process.env.DEVELOPMENT === "true";
}

export const devLog = (message: string) => 
{
    if(isDevelopmentInstance())
    {
        console.log(message);
    }
}