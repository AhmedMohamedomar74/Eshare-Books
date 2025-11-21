import { Schema, model } from "mongoose";
import { friendRequestStatusEnum, roleEnum } from "../../enum.js";



const friendRequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status: {
        type: String,
        enum: Object.values(friendRequestStatusEnum),
        default: friendRequestStatusEnum.pending
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    respondedAt: {
        type: Date
    }
});

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
    password: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.user
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
    },
    resetCode: {
        type: String
    },
    resetCodeExpires: {
        type: Date
    },
    // Friend requests sent by this user
    sentFriendRequests: [friendRequestSchema],
    // Friend requests received by this user
    receivedFriendRequests: [friendRequestSchema],
    // List of accepted friends (for quick access)
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }]
},
    {
        timestamps: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    })

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.secondName}`
})

userSchema.virtual("fullName").set(function (fullname) {
    this.firstName = fullname.split(" ")[0]
    this.secondName = fullname.split(" ")[1]
})

const userModel = model("user", userSchema)

export default userModel