import bcrypt from "bcryptjs"


export const genrateHash = async ({plainText = "" ,saltRound = 12 })=>
{
    return bcrypt.hashSync(plainText,saltRound)
}

export const compareHash = async ({plainText = "" , hashText = ""})=>
{
    console.log({plainText , hashText})
    return bcrypt.compareSync(plainText,hashText)
}