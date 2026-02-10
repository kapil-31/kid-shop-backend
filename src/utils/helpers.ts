import bcrypt from 'bcrypt'
export const hash = async (str:string) => await  bcrypt.hash(str,10) 


export const successResponse = (data:any,message:string = 'success') => ({
    data,
    message
})