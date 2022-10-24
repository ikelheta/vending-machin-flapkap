import { Product } from "../model/product";
import { createToken } from './../middleware/authontication';
import { User, IUser } from './../model/user';
import { mergeMap, of, from, map, forkJoin, throwError, tap } from "rxjs";
import ProductSchema from "../db/product"
import bcrypt from "bcrypt"
import { Observable } from 'rx';

export class ProductController {
  public static createProduct(body, sellerId) {

    const { amountAvailable, cost, productName } = body
    if (!amountAvailable || !cost || !productName) {
      return of(true).pipe(
        mergeMap(() => throwError(() => 1))
      )
    }
    if (amountAvailable % 1 !== 0 || amountAvailable < 0) {
      return of(true).pipe(
        mergeMap(() => throwError(() => 2))
      )
    }
    if (cost < 0) {
      return of(true).pipe(
        mergeMap(() => throwError(() => 3))
      )
    }
    const product = new Product(body)
    return of(true).pipe(
      mergeMap(() => ProductSchema.create({ ...product, sellerId })),
      map((m) => {
        const { sellerId, ...product } = m._doc
        return product

      })
    )

  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  public static findProduct(id: string) {
    return of(true).pipe(
      mergeMap(() => ProductSchema.findById(id))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  public static findAllProductPagination(pn: number) {
    return of(true).pipe(
      mergeMap(() => {
        return forkJoin([
          this.allProduct(pn),
          this.productCount()
        ])
      }),
      map((m) => ({ data: m[0], colSize: m[1] }))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  private static allProduct(pn: number) {
    return of(true).pipe(
      mergeMap(() => ProductSchema.find({}).sort({ _id: -1 }).skip((pn - 1) * 10).limit(10)),
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  private static productCount() {
    return of(true).pipe(
      mergeMap(() => ProductSchema.find({}).count()),
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  public static deleteProduct(id: string, sellerId) {
    return of(true).pipe(
      mergeMap(() => ProductSchema.findOneAndDelete({ _id: id, sellerId })),
      tap((m) => console.log(m)),
      mergeMap((m) => !m ? throwError(() => 1) : of(m))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  public static updateProduct(id: string, sellerId, data) {
    const { cost, amountAvailable } = data

    if (amountAvailable !== null && amountAvailable % 1 === 0 && amountAvailable >= 0) {
      return of(true).pipe(
        mergeMap(() => ProductSchema.findOneAndUpdate({ _id: id, sellerId }, { ...data, sellerId }, { new: true })),
        mergeMap((m) => !m ? throwError(() => 1) : of(m))
      )
    } else {
      return of(true).pipe(
        mergeMap(() => throwError(() => 2))
      )
    }



  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------
}