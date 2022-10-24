export interface IUser {
  userName: string,
  password: string,
  deposit: number,
  role: string
}

export class User implements IUser {
  userName: string
  password: string
  deposit: number
  role: string
  constructor(o?: any) {
    o = o ? o : {};
    this.userName = o.userName
    this.password = o.password
    this.deposit = 0
    this.role = o.role

  }
}