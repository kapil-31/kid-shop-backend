import bcrypt from 'bcrypt'
export const hash = async (str:string) => await  bcrypt.hash(str,10) 


export const successResponse = (data:any,message:string = 'success') => ({
    data,
    message
})


export const throwError  = (msg:string,status=400) => {
    const error:any = new Error(msg)
    error.statusCode = status
    throw error;
}