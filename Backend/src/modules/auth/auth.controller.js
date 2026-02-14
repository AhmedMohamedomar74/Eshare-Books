import userModel from "../../DB/models/User.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponce } from "../../utils/Response.js"
import { create, findOne } from "../../DB/db.services.js"
import { compareHash, genrateHash } from "../../utils/secuirty/hash.services.js"
import { decodeEmailToken, generateAuthTokens, generateEmailTokens, genrateToken, verify } from "../../utils/secuirty/token.services.js"
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



    const { password, email } = req.body
    console.log({ password, email })
    const findUser = await findOne({
        model: userModel, filter: {
            email: email
        }
    })

    if (findUser) {
        console.log("duplicate user", findUser)
        next(new Error("User already Exsits", { cause: 409 }))
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
    console.log({ tokens })
    successResponce({ res, data: tokens });
})


export const verfiyEmail = asyncHandler(async (req, res, next) => {
    let decode = verify({ token: req.params.email, key: process.env.EMAIL_TOKEN_SIGNATURE })
    console.log({ decode })
    if (!decode) {
        next(new Error("unvalid token", { cause: 401 }))
        return
    }
    const findUser = await userModel.findOneAndUpdate({ email: decode.email }, { isConfirmed: true })
    if (!findUser) {
        next(new Error("User not found", { cause: 400 }))
        return
    }
    successResponce({ res: res, status: 200, message: "Success to verify email", data: findUser })
})



export const refreshToken = asyncHandler(async (req, res, next) => {
    // The user is already attached to req by refreshAuth middleware
    const user = req.user;

    if (!user) {
        return next(new Error("Invalid refresh token", { cause: 401 }));
    }

    // Check if user still exists and is confirmed
    const currentUser = await findOne({
        model: userModel,
        filter: {
            _id: user._id,
            isConfirmed: true
        }
    });

    if (!currentUser) {
        return next(new Error("User not found or not confirmed", { cause: 404 }));
    }

    // Generate new tokens
    const tokens = generateAuthTokens(currentUser);

    successResponce({
        res,
        message: "Tokens refreshed successfully",
        data: tokens
    });
})