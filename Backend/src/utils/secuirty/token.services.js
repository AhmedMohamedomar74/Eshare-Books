import jwt from "jsonwebtoken"
import { asyncHandler } from "../asyncHandler.js"
import { findOne } from "../../DB/db.services.js"
import userModel, { roleEnum } from "../../DB/models/User.model.js"
import { successResponce } from "../Response.js"
export const signatureLevelEnum = { admin: "admin", user: "Bearer" }
export const signatureKeySelectEnum = { acess: "acess", refresh: "refresh" }
export const genrateToken = ({ data = {}, key = {}, options = {} }) => {
    console.log({data,key,options})
    return jwt.sign(data, key, options)
}

export const verify = ({ token = {}, key = {} }) => {
    return jwt.verify(token, key)
}

export const selectSignatureLevel = (signatureLevel) => {
    let signatures = { access: undefined, refresh: undefined }
    switch (signatureLevel) {
        case signatureLevelEnum.user:
            signatures.access = process.env.USER_ACESS_TOKEN_SIGNATURE
            signatures.refresh = process.env.USER_REFRESH_TOKEN_SIGNATURE
            break;

        case signatureLevelEnum.admin:
            signatures.access = process.env.SYSTEM_ACESS_TOKEN_SIGNATURE
            signatures.refresh = process.env.SYSTEM_REFRESH_TOKEN_SIGNATURE
            break;

        default:
            break;
    }
    return signatures
}


export const decodeToken = ({ selectKey = signatureKeySelectEnum.acess }) => {
    return asyncHandler(async (req, res, next) => {
        let decode = undefined
        console.log({ selectKey })
        const { authorization } = req.headers
        const [Bearer, token] = authorization.split(" ")
        if (!Bearer || !token) {
            return next(new Error("Authorization token is required", { cause: 401 }))
        }
        const signatureLevel = selectSignatureLevel(Bearer)
        console.log({ signatureLevel, selectKey })
        switch (selectKey) {
            case signatureKeySelectEnum.acess:
                decode = verify({ token: token, key: signatureLevel.access })
                break;
            case signatureKeySelectEnum.refresh:
                decode = verify({ token: token, key: signatureLevel.refresh })
                console.log({ decode })
                break;
            default:
                console.log(selectKey)
                break;
        }



        console.log(decode)
        const findUser = await findOne({ model: userModel, filter: { _id: decode._id , isConfirmed : true } })
        console.log({ findUser })
        if (!findUser) {
            return next(new Error("User not found", { cause: 404 }))
        }
        // successResponce({res:res , data:findUser})
        req.user = findUser

        next()
    })
}

export const generateAuthTokens = (user) => {
    const signatureLevel = user.role === roleEnum.user
        ? signatureLevelEnum.user
        : signatureLevelEnum.admin;

    const signatures = selectSignatureLevel(signatureLevel);

    const tokenPayload = { IslogIn: true, _id: user.id };

    const accessToken = genrateToken({
        data: tokenPayload,
        key: signatures.access,
        options: { expiresIn: process.env.ACESS_TOKEN_EXPIRE_IN }
    });

    const refreshToken = genrateToken({
        data: tokenPayload,
        key: signatures.refresh,
        options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    });

    return { accessToken, refreshToken };
};


export const generateEmailTokens = (user) => {
    const tokenPayload = { _id: user._id, email: user.email };

    const accessToken = genrateToken({
        data: tokenPayload,
        key: process.env.EMAIL_TOKEN_SIGNATURE,
        options: { expiresIn: process.env.ACESS_TOKEN_EXPIRE_IN }
    });
    return { accessToken };
};


export const decodeEmailToken = ({ token }) => {
    return asyncHandler(async (req, res, next) => {
        let decode = undefined
        console.log({ token })
        decode = await verify({ token: token, key: process.env.EMAIL_TOKEN_SIGNATURE })

        if (!decode) {
            next(new Error("unvalid token", { cause: 401 }))
            return
        }

        console.log(decode)
        const findUser = await userModel.findOneAndUpdate({email : decode.email}, { isConfirmed: true })
        console.log({findUser})
        successResponce({ res: res, status: 200, message: "Success to verify email", data: findUser })
    })
}
