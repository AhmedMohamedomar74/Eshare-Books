import eventEmitter from "node:events"
import { sendEmail } from "../utils/email.services.js"

export const sendEmailEvent = new eventEmitter()

sendEmailEvent.on("confirmEmail",async (data)=>
{
    try {
        sendEmail({to:data.to , subject : data.subject || "Confirm Email", html:data.html})
        console.log(`success to send ${data.to}`)
    } catch (error) {
        console.log("Can not send email to",data.to)
    }
})