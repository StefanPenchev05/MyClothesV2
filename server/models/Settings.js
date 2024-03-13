import {Schema, model} from "mongoose";

const settingsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    general: {
        theme: {
            type: String,
            enum: ["dark", "light", "system"],
            default: "system"
        },
        notification: {
            email: {
                type: Boolean,
                default: false
            },
            push:{
                type: Boolean,
                default: true
            }
        },
        showOnlineStatus: {
            type: Boolean,
            default: true
        },
        showOnlineStatusTo: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        hideOnlineStatusFrom: [{
            type:Schema.Types.ObjectId,
            ref: "User"
        }],
    },
    privacy: {
        hideProfileFrom: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        profileVisibility: {
            type: String,
            enum: ["public", "private", "friends"],
            default: "public"
        },
        lastSeen: {
            type: String,
            enum: ["everyone", "nobody", "friends"],
            default: "everyone"
        },
        readReceipts: {
            type: Boolean,
            default: true
        },
        blockedList: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        allowTagging: {
            type: Boolean,
            default: true
        },
        searchEngineIndexing: {
            type: Boolean,
            default: true
        },
    },
    security:{
        twoFactorAuth: {
            enabled: {
                type: Boolean,
                default: false
            },
            secret:{
                type: String,
                default: ""
            }
        },
        passwordChangeHistory: [{
            changedAt: {
                type: Date,
                default: Date.now
            },
            passwordHash: String
        }],
        accountActivity:[{
            loggedInAt:{
                type: Date,
                default: Date.now
            },
            ipAddress: String,
            device: {
                userAgent: String,
                browser: String,
                operatingSystem: String
            }
        }],
    }
});

export const Settings = model("Setting", settingsSchema);