import mongoose from "mongoose"


const ProductSchema = new mongoose.Schema({
  amountAvailable: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  cost: {
    type: Number,
    required: [true, 'Please provide cost'],

  },
  productName: {
    type: String,
    required: [true, "please provide city"]
  },

  sellerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide sellerId'],
  },



})

export default mongoose.model('Product', ProductSchema)