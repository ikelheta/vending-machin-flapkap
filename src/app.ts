import { DepositeController } from './controller/deposite';
import { ProductController } from './controller/product';
import { isTokenValid, isBuyer, isSeller } from './middleware/authontication';
import { UserController } from './controller/user';
import { LoginController } from './controller/login';
import express from "express"
import 'dotenv/config'
import { connect } from "mongoose"
import { take } from 'rxjs';
import { COINS_ARRAY, SELLER_ROLE, BUYER_ROLE } from "./utilis/constants"



const cors = require("cors")
const app = express()
app.use(express.json());
app.use(cors())



// ---------------------------------------------------------LogIn----------------------------------------------------------------------------
app.post("/api/user/login", (req, res) => {
  const p = LoginController.UserLogIn(req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {

        switch (e) {
          case 1:
            res.status(400).json({ messgage: 'user is not exist' })
            break
          case 2:
            res.status(400).json({ message: "wrong password" })
            break

          default:
            res.sendStatus(400)

        }





      }
    }
  )
})

app.post("/api/user/signup", (req, res) => {
  const p = UserController.createUser(req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        switch (e) {
          case 1:
            res.status(400).json({ messgage: 'you must provide userName, password and role hint role must be ( seller or buyer )' })
            break
          case 2:
            res.status(400).json({ message: "this user name is already exist" })
            break

          default:
            res.sendStatus(400)

        }

      }
    }
  )
})
app.get("/api/user/:id", isTokenValid, (req, res) => {
  const p = UserController.findUser(req.params.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(401)
      }
    }
  )
})

app.get("/api/users/all/:pn", isTokenValid, (req, res) => {
  const p = UserController.findAllUserPagination(Number(req.params.pn)).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(401)
      }
    }
  )
})

app.put("/api/user", isTokenValid, (req, res) => {

  const p = UserController.updateUser(req.user.id, req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        e === 1 ? res.status(403).json({ message: 'you can only update your own account' }) : res.sendStatus(400)
      }
    }
  )

})

app.delete("/api/user", isTokenValid, (req, res) => {

  const p = UserController.deleteUser(req.user.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.status(403).json({ message: 'this account is not exist' })
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------
app.post("/api/product", isTokenValid, isSeller, (req, res) => {

  const p = ProductController.createProduct(req.body, req.user.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        switch (e) {
          case 1:
            res.status(400).json({ message: 'please provide amountAvailable ,cost and productName ' })
            break
          case 2:
            res.status(400).json({ message: "amount available must be a whole positive number or 0" })
            break
          case 3:
            res.status(400).json({ message: "cost must be a  positive number or 0" })
            break
          default:
            res.sendStatus(400)

        }
      }
    }
  )

})


app.get('/api/product/:id', isTokenValid, (req, res) => {

  const p = ProductController.findProduct(req.params.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error() {
        res.status(400).json({ message: 'product not found' })
      }
    }
  )
})

app.put("/api/product/:id", isTokenValid, isSeller, (req, res) => {

  const p = ProductController.updateProduct(req.params.id, req.user.id, req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        switch (e) {
          case 1:
            res.status(403).json({ message: 'you can only delete your own products' })
            break
          case 2:
            res.status(400).json({ message: "amount available must be a whole positive number or 0" })
            break
          default:
            res.sendStatus(400)

        }

      }
    }
  )

})

app.delete("/api/product/:id", isTokenValid, isSeller, (req, res) => {
  const p = ProductController.deleteProduct(req.params.id, req.user.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        e === 1 ? res.status(403).json({ message: 'you can only delete your own products' }) : res.sendStatus(404)
      }
    }
  )



})

app.get("/api/products/all/:pn", isTokenValid, (req, res) => {

  const p = ProductController.findAllProductPagination(Number(req.params.pn)).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )

})

app.post("/api/product/buy", isTokenValid, isBuyer, (req, res) => {

  const p = DepositeController.purchaseProduct(req.body.productId, req.body.amount, req.user.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        switch (e) {
          case 1:
            res.status(400).json({ message: "please add coins to your deposit" })
            break
          case 2:
            res.status(400).json({ message: "amount available of this product is not enough" })
            break
          case 3:
            res.status(400).json({ message: 'amount should be a whole number' })
            break
          case 4:
            res.status(400).json({ message: 'this product is not exist' })
            break
          case 5:
            res.status(400).json({ message: 'your account is not exist' })
            break
          default:
            res.sendStatus(400)

        }

      }
    }
  )

})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------deposit----------------------------------------------------------------------------
app.get("/api/deposite/add/:coins", isTokenValid, isBuyer, (req, res) => {

  const coins = Number(req.params.coins)
  if (COINS_ARRAY.includes(coins)) {
    const p = DepositeController.addCoinsToAccount(req.user.id, coins).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(404)
        }
      }
    )
  } else {
    res.status(400).json({ message: `only buyers can add coins and coins must be in ${[...COINS_ARRAY]}` })
  }


})
//--------------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/api/deposit/reset", isTokenValid, isBuyer, (req, res) => {


  const p = DepositeController.resetDeposit(req.user.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )
})

//--------------------------------------------------------------------------------------------------------------------------------------------------------





const PORT = process.env.PORT || 3000

const start = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI || "")
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
export default app