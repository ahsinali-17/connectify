import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        min:2,
        max:50
    },
    lastName:{
        type: String,
        required: true,
        min:2,
        max:50
    },
    email:{
        type: String,
        required: true,
        unique: true,
        max:50
    },
    password: {
        type: String,
        required: true,
        min:5,
    },
    picturePath:{
        type: String,
        default: ''
    },
    friends:{
        type: Array,
        default: []
    },
    location: String,
    views: Number,
    impressions: Number,
    occupation: String, 
},
{timestamps: true} //automatically add createdAt and updatedAt fields
);

export const User = mongoose.model('User', userSchema)
