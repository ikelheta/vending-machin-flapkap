"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide sellerId'],
    },
});
exports.default = mongoose_1.default.model('Product', ProductSchema);
