"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_1 = require("../model/product");
const rxjs_1 = require("rxjs");
const product_2 = __importDefault(require("../db/product"));
class ProductController {
    static createProduct(body, sellerId) {
        const { amountAvailable, cost, productName } = body;
        if (!amountAvailable || !cost || !productName) {
            return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => (0, rxjs_1.throwError)(() => 1)));
        }
        if (amountAvailable % 1 !== 0 || amountAvailable < 0) {
            return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => (0, rxjs_1.throwError)(() => 2)));
        }
        if (cost < 0) {
            return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => (0, rxjs_1.throwError)(() => 3)));
        }
        const product = new product_1.Product(body);
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.create(Object.assign(Object.assign({}, product), { sellerId }))), (0, rxjs_1.map)((m) => {
            const _a = m._doc, { sellerId } = _a, product = __rest(_a, ["sellerId"]);
            return product;
        }));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static findProduct(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.findById(id)));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static findAllProductPagination(pn) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => {
            return (0, rxjs_1.forkJoin)([
                this.allProduct(pn),
                this.productCount()
            ]);
        }), (0, rxjs_1.map)((m) => ({ data: m[0], colSize: m[1] })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static allProduct(pn) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.find({}).sort({ _id: -1 }).skip((pn - 1) * 10).limit(10)));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static productCount() {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.find({}).count()));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static deleteProduct(id, sellerId) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.findOneAndDelete({ _id: id, sellerId })), (0, rxjs_1.tap)((m) => console.log(m)), (0, rxjs_1.mergeMap)((m) => !m ? (0, rxjs_1.throwError)(() => 1) : (0, rxjs_1.of)(m)));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static updateProduct(id, sellerId, data) {
        const { cost, amountAvailable } = data;
        if (amountAvailable !== null && amountAvailable % 1 === 0 && amountAvailable >= 0) {
            return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.findOneAndUpdate({ _id: id, sellerId }, Object.assign(Object.assign({}, data), { sellerId }), { new: true })), (0, rxjs_1.mergeMap)((m) => !m ? (0, rxjs_1.throwError)(() => 1) : (0, rxjs_1.of)(m)));
        }
        else {
            return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => (0, rxjs_1.throwError)(() => 2)));
        }
    }
}
exports.ProductController = ProductController;
