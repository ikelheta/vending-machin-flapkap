"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositeController = void 0;
const constants_1 = require("./../utilis/constants");
const rxjs_1 = require("rxjs");
const user_1 = __importDefault(require("../db/user"));
const product_1 = __importDefault(require("../db/product"));
const rxjs_2 = require("rxjs");
class DepositeController {
    static addCoinsToAccount(id, coins) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findByIdAndUpdate(id, { $inc: { deposit: coins } }, { new: true })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static purchaseProduct(productId, amount, buyerId) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => {
            return (0, rxjs_1.forkJoin)([
                this.findProduct(productId),
                this.findUser(buyerId)
            ]);
        }), (0, rxjs_1.mergeMap)((m) => {
            const total = m[0].cost * amount;
            if (total > m[1].deposit) {
                return (0, rxjs_2.throwError)(() => 1);
            }
            if (m[0].amountAvailable < amount) {
                return (0, rxjs_2.throwError)(() => 2);
            }
            if (amount % 1 != 0) {
                return (0, rxjs_2.throwError)(() => 3);
            }
            else {
                return (0, rxjs_1.of)(m);
            }
        }), (0, rxjs_1.mergeMap)((m) => {
            let cost = m[0].cost * amount;
            return (0, rxjs_1.forkJoin)([
                this.calculatePurchaseProduct(productId, amount),
                this.calculatePurchaseBuyer(buyerId, cost),
                this.calculatePurchaseSeller(m[0].sellerId, cost),
            ]);
        }), (0, rxjs_1.map)((m) => ({ product: m[0].productName, amount, remainedDeposit: m[1].deposit, change: this.getChange(m[1].deposit) })));
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    static resetDeposit(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findByIdAndUpdate(id, { deposit: 0 }, { new: true }).select(['-_id', '-password'])));
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    static calculatePurchaseProduct(id, amount) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_1.default.findByIdAndUpdate(id, { $inc: { amountAvailable: -amount } }, { new: true })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static calculatePurchaseBuyer(id, cost) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findByIdAndUpdate(id, { $inc: { deposit: -cost } }, { new: true })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static calculatePurchaseSeller(sellerId, cost) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findByIdAndUpdate({ _id: sellerId }, { $inc: { deposit: cost } }, { new: true })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static findProduct(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_1.default.findById(id)), (0, rxjs_1.catchError)(() => (0, rxjs_2.throwError)(() => 4)));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static findUser(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findById(id).select(["-password", "-_id"])), (0, rxjs_1.catchError)(() => (0, rxjs_2.throwError)(() => 5)));
    }
    // ----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static getChange(remainingmoney) {
        let change = [];
        const coinsArray = constants_1.COINS_ARRAY.sort((a, b) => b - a);
        for (let i = 0; i < coinsArray.length;) {
            if (coinsArray[i] <= remainingmoney && remainingmoney != 0) {
                change.push(coinsArray[i]);
                remainingmoney -= coinsArray[i];
            }
            else {
                i += 1;
            }
        }
        return change;
    }
}
exports.DepositeController = DepositeController;
