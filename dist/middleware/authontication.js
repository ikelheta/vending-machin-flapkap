"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.isSeller = exports.isBuyer = exports.isTokenValid = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const constants_1 = require("../utilis/constants");
const isTokenValid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (token) {
            const { verified, user } = verifyToken(token);
            if (!verified) {
                res.status(403).json({ error: 'token not valid' });
            }
            else {
                req.user = user;
                next();
            }
        }
        else {
            res.status(401).json({ error: 'please login first' });
        }
    }
    catch (error) {
        res.status(401).json({ error });
    }
});
exports.isTokenValid = isTokenValid;
// ##################################################################################################################################
// ##################################################################################################################################
const verifyToken = (token) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
        const user = { id: payload.id, role: payload.role };
        return { verified: true, user };
    }
    catch (_a) {
        return { verified: false, user: undefined };
    }
};
// ##################################################################################################################################
// ##################################################################################################################################
const isBuyer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    user.role === constants_1.BUYER_ROLE ? next() : res.status(401).json({ error: 'you must be a buyer' });
});
exports.isBuyer = isBuyer;
// ##################################################################################################################################
// ##################################################################################################################################
const isSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    user.role === constants_1.SELLER_ROLE ? next() : res.status(401).json({ error: 'you must be a Sseller' });
});
exports.isSeller = isSeller;
// ##################################################################################################################################
// ##################################################################################################################################
const createToken = (user) => {
    const id = user._doc._id;
    const role = user._doc.role;
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "secret", {
        expiresIn: '30d',
    });
};
exports.createToken = createToken;
