import mongoose from 'mongoose'
import crypto from 'crypto';
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
            enum:['Patient','Doctor','admin'],
            default:'Patient',
        },
        
        isApproved:{
            type:Boolean,
            default: function() {
                return this.role === 'Patient'; 
            },
        },

        inviteToken: {
            type: String,
            unique: true,
            sparse: true,
        },

        inviteTokenExpires: {
            type: Date,
        },

        specialization: {
            type: String,
            required: function() {
                return this.role === 'Doctor';
            },
        },

        contactNumber: {
            type: String,
        },

        availableTimeSlots: [{
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
            slots: [String], // e.g. ["09:00-09:30", "09:30-10:00"]
        }],
    },
    { timestamps: true }
)

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  UserSchema.methods.generateInviteToken =  async function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.inviteToken = crypto.createHash('sha256').update(token).digest('hex');
    this.inviteTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    return token;
};

UserSchema.statics.createFirstAdmin = async function(adminData) {
    try {
        const existingAdmin = await this.findOne({ email: adminData.email });

        if (existingAdmin) {
            console.log("✅ Admin already exists:", existingAdmin.email);
            return existingAdmin;
        }

        console.log("🔹 No admin found. Creating default admin...");
        const admin = await this.create({
            ...adminData,
            role: 'admin',
            isApproved: true
        });

        return admin;
    } catch (error) {
        console.error("❌ Error creating admin:", error);
    }
};



const User=mongoose.model("User",UserSchema)

export default User;