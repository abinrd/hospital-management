import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Username is required'],
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

        password:{
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

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

const User=mongoose.model("User",UserSchema)

export default User;