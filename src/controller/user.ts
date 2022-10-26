import { createToken } from './../middleware/authontication';
import { User, IUser } from './../model/user';
import { mergeMap, of, from, map, forkJoin, throwError, tap } from "rxjs";
import UserSchema from "../db/user"
import bcrypt from "bcrypt"
import { Observable } from 'rx';


export class UserController {
  public static createUser(body) {
    const { password, userName, role } = body
    if (!userName || !password || !role) {
      return of(true).pipe(mergeMap(() => throwError(() => 1)))
    }

    const user = new User(body)

    return of(user).pipe(
      mergeMap((m) => from(UserSchema.find({ userName }))),
      mergeMap((m) => m.length === 0 ? of(user) : throwError(() => 2)),
      mergeMap((m) => from(bcrypt.hash(m.password, 10))),
      mergeMap((m) => from(UserSchema.create({ ...user, password: m }))),
      map((m) => {
        return { token: createToken({ ...m }) }
      })
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  public static findUser(id: string) {
    return of(true).pipe(
      mergeMap(() => UserSchema.findById(id).select(["-password", "-_id"])),
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 
  public static findAllUserPagination(pn: number) {
    return of(true).pipe(
      mergeMap(() => {
        return forkJoin([
          this.allUser(pn),
          this.userCount()
        ])
      }),
      map((m) => ({ data: m[0], colSize: m[1] }))
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 
  private static allUser(pn: number) {
    return of(true).pipe(
      mergeMap(() => UserSchema.find({}).sort({ _id: -1 }).skip((pn - 1) * 10).limit(10).select(["-password", '-_id'])),
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 
  private static userCount() {
    return of(true).pipe(
      mergeMap(() => UserSchema.find({}).count()),
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 

  public static deleteUser(id: string) {
    return of(true).pipe(
      mergeMap(() => UserSchema.findByIdAndDelete(id).select(["-password", "-_id"]))
    )
  }
  //---------------------------------------------------------------------------------------------------------------------------------------------------- 
  public static updateUser(id: string, data) {
    const { password } = data
    return of(true).pipe(
      mergeMap(() => from(bcrypt.hash(password, 10))),
      mergeMap((m) => UserSchema.findByIdAndUpdate(id, { password: m }, { new: true }).select(["-password", "-_id"])),
      mergeMap((m) => m ? of(m) : throwError(() => 1))
    )
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------
}