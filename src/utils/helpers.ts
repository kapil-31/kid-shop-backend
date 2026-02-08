import bcrypt from 'bcrypt'
export const hash = async (str:string) => await  bcrypt.hash(str,10) 