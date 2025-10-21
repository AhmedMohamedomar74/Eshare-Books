import { Schema, model } from "mongoose";

export const genderEnum = { male: "male", female: "female" }
export const roleEnum = { admin: "admin", user: "user" }
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    secondName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password:
    {
        type: String,
        required: true
    },
    userName:
    {
        type: String,
        unique: true,
        required: true,
    },
    DOB:
    {
        type: Date
    },
    gender:
    {
        type: String,
        enum: Object.values(genderEnum),
        default: genderEnum.male
    },
    role:
    {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.user
    },
    isConfirmed : 
    {
        type : Boolean,
        default : false
    }
},
    {
        timestamps: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: false
        }
    })

userSchema.virtual("fullName").get(function () {
    return `${this.firstName}  ${this.secondName}`
})


userSchema.virtual("fullName").set(function (fullname) {
    this.firstName = fullname.split(" ")[0]
    this.secondName = fullname.split(" ")[1]
})

userSchema.virtual("age").get(function () {
    let currentDate = new Date()
    let DOB = new Date(this.DOB)

    return currentDate.getFullYear() - DOB.getFullYear()
})
const userModel = model("user", userSchema)

export default userModel