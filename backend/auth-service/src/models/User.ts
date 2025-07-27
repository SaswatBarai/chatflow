import mongoose,{Document,Schema} from 'mongoose';

export interface IUser extends Document{
    email: string;
    phone?: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    lastSeen : Date;
    isOnline: boolean;
    status:"active" | "inactive" | "suspended";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema  = new Schema<IUser> ({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone:{
        type: String,
        unique: true,
        sparse: true, // Allows for unique phone numbers even if some users don't have a phone number
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    firstName:{
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    profilePicture :{
        type: String,
        default: null,
        trim: true
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    isPhoneVerified:{
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },

    isOnline: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    }
},{
    timestamps: true 
})

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

const User = mongoose.model<IUser>('User', UserSchema);
export default User;

