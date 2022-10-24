export interface IProduct {
  amountAvailable: number,
  cost: number,
  productName: string,
  sellerId: string
}

export class Product implements IProduct {
  amountAvailable: number
  cost: number
  productName: string
  sellerId: string

  constructor(o?: any) {
    o = o ? o : {};
    this.amountAvailable = o.amountAvailable
    this.cost = o.cost
    this.productName = o.productName
    this.sellerId = o.sellerId
  }
}