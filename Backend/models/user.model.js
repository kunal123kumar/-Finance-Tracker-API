import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is requried"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is requried"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is requried"],
        minlength: [6, "Password must be at least 6 characters"],
        trim: true,
    },
    role: {
        type: String,
        enum: ["Viewer","analyst", "admin"],
        default: "Viewer",
    },
    isactive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;