import userModel from "../../DB/models/User.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponce } from "../../utils/Response.js"
import { create, findOne } from "../../DB/db.services.js"
import { compareHash, genrateHash } from "../../utils/secuirty/hash.services.js"
import { decodeEmailToken, generateAuthTokens, generateEmailTokens, genrateToken, verify } from "../../utils/secuirty/token.services.js"
import { sendEmailEvent } from "../../Events/sendEmail.event.js"
import { resetPasswordTemplate, template } from "../../utils/email.services.js"
import { decode } from "jsonwebtoken"
import { genrateRandomNumber } from "../../utils/random.services.js" 
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


export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Find user by email
    const user = await findOne({
        model: userModel,
        filter: { email }
    });

    if (!user) {
        // For security reasons, don't reveal if email exists or not
        successResponce({ 
            res, 
            message: "If the email exists, a reset code has been sent" 
        });
        return;
    }

    // Generate reset code (6-digit number)
    const resetCode = genrateRandomNumber(6);
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset code and expiry to user document
    await userModel.findByIdAndUpdate(user._id, {
        resetCode,
        resetCodeExpires
    });

    // Send reset code via email
    sendEmailEvent.emit("resetPassword", { 
        to: email, 
        html: resetPasswordTemplate(resetCode) // You might want to create a different template for reset codes
    });

    successResponce({ 
        res, 
        message: "If the email exists, a reset code has been sent" 
    });
});

export const verifyResetCode = asyncHandler(async (req, res, next) => {
    const { email, resetCode } = req.body;

    // Find user with valid reset code
    const user = await findOne({
        model: userModel,
        filter: {
            email,
            resetCode,
            resetCodeExpires: { $gt: new Date() }
        }
    });

    if (!user) {
        next(new Error("Invalid or expired reset code", { cause: 400 }));
        return;
    }

    // Generate a temporary token for password reset
    const resetToken = genrateToken({
        payload: { 
            _id: user._id,
            purpose: 'password_reset'
        },
        key: process.env.RESET_TOKEN_SIGNATURE,
        options: { expiresIn: '15m' }
    });

    successResponce({ 
        res, 
        message: "Reset code verified successfully",
        data: { resetToken }
    });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { resetToken, newPassword } = req.body;

    // Verify reset token
    const decoded = verify({ 
        token: resetToken, 
        key: process.env.RESET_TOKEN_SIGNATURE 
    });

    if (!decoded || decoded.purpose !== 'password_reset') {
        next(new Error("Invalid or expired reset token", { cause: 401 }));
        return;
    }

    // Find user
    const user = await findOne({
        model: userModel,
        filter: { _id: decoded._id }
    });

    if (!user) {
        next(new Error("User not found", { cause: 404 }));
        return;
    }

    // Hash new password
    const hashedPassword = await genrateHash({ 
        plainText: newPassword, 
        saltRound: parseInt(process.env.HASH_SALT_ROUND) 
    });

    // Update password and clear reset code
    await userModel.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetCode: undefined,
        resetCodeExpires: undefined
    });

    successResponce({ 
        res, 
        message: "Password reset successfully" 
    });
});