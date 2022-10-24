import * as jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { BUYER_ROLE, SELLER_ROLE } from "../utilis/constants"

export const isTokenValid = async (req: Request, res: Response, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const { verified, user } = verifyToken(token)
      if (!verified) {
        res.status(403).json({ error: 'token not valid' })
      } else {
        req.user = user
        next()
      }

    } else {
      res.status(401).json({ error: 'please login first' })
    }
  } catch (error) {
    res.status(401).json({ error })
  }
}
// ##################################################################################################################################
// ##################################################################################################################################
const verifyToken = (token: any) => {
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || "secret")
    const user = { id: payload.id, role: payload.role }
    return { verified: true, user }
  } catch {
    return { verified: false, user: undefined }
  }


}




// ##################################################################################################################################
// ##################################################################################################################################

export const isBuyer = async (req: Request, res: Response, next) => {

  const user = req.user
  user.role === BUYER_ROLE ? next() : res.status(401).json({ error: 'you must be a buyer' })

}
// ##################################################################################################################################
// ##################################################################################################################################

export const isSeller = async (req: Request, res: Response, next) => {
  const user = req.user
  user.role === SELLER_ROLE ? next() : res.status(401).json({ error: 'you must be a Sseller' })

}
// ##################################################################################################################################
// ##################################################################################################################################
export const createToken = (user: any) => {
  const id = user._doc._id
  const role = user._doc.role
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "secret", {
    expiresIn: '30d',
  })
}


