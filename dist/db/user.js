"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
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
});
exports.default = mongoose_1.default.model('User', ProductSchema);
