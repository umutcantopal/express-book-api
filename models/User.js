import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Add an username'],
  },
  password: {
    type: String,
    required: [true, 'Add a password'],
    minlength: 8,
    select: false, // don't bring pasword field when fetching user data
  },
  email: {
    type: String,
    required: [true, 'Add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'moderator'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// encrpyt password
UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// jwt
UserSchema.methods.getSignedJwt = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

// compare coming password from payload with hashed password from db
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', UserSchema)

export default User
