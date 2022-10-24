import { Observable, of, throwError, tap, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { createToken } from '../middleware/authontication';
import bcrypt from "bcrypt"
import UserSchema from "../db/user"

export class LoginController {
  public static UserLogIn(body): Observable<any> {
    const { userName, password } = body
    let user;
    return of(true).pipe(
      mergeMap(() => from(UserSchema.findOne({ userName }))),

      tap((t) => user = t),
      mergeMap((m: any) => m ? from(bcrypt.compare(password, m.password)) : throwError(() => 1)),
      mergeMap((m) => m ? of({ token: createToken({ ...user }), id: user._id }) : throwError(() => 2))
    )
  }
  //-----------------------------------------------------------------------------------------------------------------------------------------------------
}