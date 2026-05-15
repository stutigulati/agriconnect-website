import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:     { type: String, default: null, select: false },
    role:         { type: String, enum: ['Farmer', 'Agronomist', 'Buyer'], default: 'Farmer' },
    profileImage: { type: String, default: '' },
    location:     { type: String, default: 'India' },
    bio:          { type: String, default: '' },
    isVerified:   { type: Boolean, default: false },   // for Agronomists
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  if (!this.password) return false;
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
