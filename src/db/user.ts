import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Please provide an userName'],
    unique: true
  },
  deposit: {
    type: Number,
    required: [true, 'Please provide deposit'],
    default: 0
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },

  role: {
    type: String,
    enum: ['seller', 'buyer'],
    required: [true, 'Please provide your experience level'],
  },



})

export default mongoose.model('User', ProductSchema)