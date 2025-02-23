import mongoose from 'mongoose'

const UserSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            reqired:[true,'Username is required'],
            trim:true,
            minLength:3,
            maxLength:36,
        },

        email:{
            type:String,
            required:[true,'Email is required'],
            unique:true,
            lowercase:true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },

        passsword:{
            type:String,
            required:[true,'Password is required'],
            minLength:8,
    },
        role:{
            type:String,
            enum:['Patient','Doctor','Admin'],
            default:'Patient',
        },
        
        isApproved:{
            type:Boolean,
            default:false,
        },
    },{timestamps:true}
)

const User=mongoose.model("User",UserSchema)

export default User;