import { COINS_ARRAY } from './../utilis/constants';
import { Product } from "../model/product";
import { createToken } from './../middleware/authontication';
import { User, IUser } from './../model/user';
import { mergeMap, of, from, map, forkJoin, delay, catchError } from "rxjs";
import UserSchema from "../db/user"
import ProductSchema from "../db/product"
import bcrypt from "bcrypt"
import { Observable, throwError } from 'rxjs';




export class DepositeController {
  public static addCoinsToAccount(id: string, coins: number) {
    return of(true).pipe(
      mergeMap(() => UserSchema.findByIdAndUpdate(id, { $inc: { deposit: coins } }, { new: true })),

    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------- 
  public static purchaseProduct(productId: string, amount: number, buyerId) {
    return of(true).pipe(
      mergeMap(() => {
        return forkJoin([
          this.findProduct(productId),
          this.findUser(buyerId)
        ])
      }),
      mergeMap((m) => {
        if (m[0].cost * amount > m[1].deposit) {
          return throwError(() => 1)
        }
        if (m[0].amountAvailable < amount) {
          return throwError(() => 2)
        }
        if (amount % 1 != 0) {
          return throwError(() => 3)
        }
        else {
          return of(m)
        }
      }),
      mergeMap((m) => {
        let cost = m[0].cost * amount
        return forkJoin([
          this.calculatePurchaseProduct(productId),
          this.calculatePurchaseBuyer(buyerId, cost),
          this.calculatePurchaseSeller(m[0].sellerId, cost),

        ])
      }),
      map((m) => ({ product: m[0].productName, amount, remainedDeposit: m[1].deposit, change: this.getChange(m[1].deposit) }))
    )
  }
  //-----------------------------------------------------------------------------------------------------------------------------------------------------
  public static resetDeposit(id: string) {
    return of(true).pipe(
      mergeMap(() => UserSchema.findByIdAndUpdate(id, { deposit: 0 }, { new: true }))
    )
  }


  //-----------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------

  //-----------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------

  private static calculatePurchaseProduct(id: string): Observable<Product> {
    return of(true).pipe(
      mergeMap(() => ProductSchema.findByIdAndUpdate(id, { $inc: { amountAvailable: -1 } }, { new: true }))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------- 
  private static calculatePurchaseBuyer(id: string, cost: number): Observable<User> {
    return of(true).pipe(
      mergeMap(() => UserSchema.findByIdAndUpdate(id, { $inc: { deposit: -cost } }, { new: true }))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------- 
  private static calculatePurchaseSeller(sellerId: string, amount: number) {
    return of(true).pipe(
      mergeMap(() => UserSchema.findByIdAndUpdate({ _id: sellerId }, { $inc: { deposit: amount } }, { new: true }))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------- 
  //----------------------------------------------------------------------------------------------------------------------------------------------------- 
  private static findProduct(id: string): Observable<any> {
    return of(true).pipe(
      mergeMap(() => ProductSchema.findById(id)),
      catchError(() => throwError(() => 4))

    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------- 
  private static findUser(id: string): Observable<User> {
    return of(true).pipe(
      mergeMap(() => UserSchema.findById(id).select(["-password", "-_id"])),
      catchError(() => throwError(() => 5))
    )
  }
  // ----------------------------------------------------------------------------------------------------------------------------------------------------- 
  private static getChange(remainingmoney) {
    let change: number[] = []
    const coinsArray = COINS_ARRAY.sort((a, b) => b - a)
    for (let i = 0; i < coinsArray.length;) {
      if (coinsArray[i] <= remainingmoney && remainingmoney != 0) {
        change.push(coinsArray[i])
        remainingmoney -= coinsArray[i]
      } else {
        i += 1
      }
    }

    return change
  }

}