"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(o) {
        o = o ? o : {};
        this.amountAvailable = o.amountAvailable;
        this.cost = o.cost;
        this.productName = o.productName;
        this.sellerId = o.sellerId;
    }
}
exports.Product = Product;
