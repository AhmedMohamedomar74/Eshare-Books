import userModel from "../../DB/models/User.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponce } from "../../utils/Response.js"
import { create, findOne } from "../../DB/db.services.js"
import { compareHash, genrateHash } from "../../utils/secuirty/hash.services.js"
import { decodeEmailToken, generateAuthTokens, generateEmailTokens, genrateToken, selectSignatureLevel, signatureLevelEnum, verify } from "../../utils/secuirty/token.services.js"
import { sendEmailEvent } from "../../Events/sendEmail.event.js"
import { template } from "../../utils/email.services.js"
import { decode } from "jsonwebtoken"
export const signup = asyncHandler(async (req, res, next) => {
    /**
         * @Doing
         * reterive data 
         * check user existance with number and email
         * save to db 
         *
         * hash password 
         * send email OTP
         * send session
         */



    const { password, email, userName } = req.body
    console.log({ password, email, userName })
    const findUser = await findOne({
        model: userModel, filter: {
            $or: [
                { email: email },
                { userName: userName }
            ]
        }
    })
    if (findUser) {
        next(new Error("User already Exsits",{ cause: 409 }))
        return
    }
    if (password) {
        let n_password = await genrateHash({ plainText: password, saltRound: parseInt(process.env.HASH_SALT_ROUND) })
        req.body.password = n_password
    }
    else {
        next(new Error("there is no passowrd", { cause: 400 }))
        return
    }
    if (req.body.email) {
        const emailToken = generateEmailTokens(req.body)
        sendEmailEvent.emit("confirmEmail", { to: req.body.email, html: template(emailToken.accessToken) })
    }
    const newUser = await create({
        model: userModel,
        data: req.body
    });
    successResponce({ res: res, data: newUser })
    return
})

export const login = asyncHandler(async (req, res, next) => {
    const tokens = generateAuthTokens(req.user);
    console.log({tokens})
    successResponce({ res, data: tokens.accessToken });
})


export const verfiyEmail = asyncHandler(async (req, res, next) => {
    let decode = verify({ token: req.params.email, key: process.env.EMAIL_TOKEN_SIGNATURE })
    console.log({decode})
    if (!decode) {
        next(new Error("unvalid token", { cause: 401 }))
        return
    }
    const findUser = await userModel.findOneAndUpdate({email : decode.email}, { isConfirmed: true })
    if (!findUser) {
        next(new Error("User not found", { cause: 400 }))
        return
    }
    successResponce({ res: res, status: 200, message: "Success to verify email", data: findUser })
})