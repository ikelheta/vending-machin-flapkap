"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deposite_1 = require("./controller/deposite");
const product_1 = require("./controller/product");
const authontication_1 = require("./middleware/authontication");
const user_1 = require("./controller/user");
const login_1 = require("./controller/login");
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const mongoose_1 = require("mongoose");
const rxjs_1 = require("rxjs");
const constants_1 = require("./utilis/constants");
const cors = require("cors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
// ---------------------------------------------------------LogIn----------------------------------------------------------------------------
app.post("/login/user", (req, res) => {
    const p = login_1.LoginController.UserLogIn(req.body).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            switch (e) {
                case 1:
                    res.status(400).json({ messgage: 'user is not exist' });
                    break;
                case 2:
                    res.status(400).json({ message: "wrong password" });
                    break;
                default:
                    res.sendStatus(400);
            }
        }
    });
});
// ---------------------------------------------------------signUp----------------------------------------------------------------------------
app.post("/signup", (req, res) => {
    const p = user_1.UserController.createUser(req.body).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            switch (e) {
                case 1:
                    res.status(400).json({ messgage: 'you must provide userName, password and role hint role must be ( seller or buyer )' });
                    break;
                case 2:
                    res.status(400).json({ message: "this user name is already exist" });
                    break;
                default:
                    res.sendStatus(400);
            }
        }
    });
});
//-------------------------------------------------------------User-------------------------------------------------------------------------------------------
app.get("/user/:id", authontication_1.isTokenValid, (req, res) => {
    const p = user_1.UserController.findUser(req.params.id).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(401);
        }
    });
});
//-------------------------------------------------------------User-------------------------------------------------------------------------------------------
app.get("/users/all/:pn", authontication_1.isTokenValid, (req, res) => {
    const p = user_1.UserController.findAllUserPagination(Number(req.params.id)).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(401);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.put("/user/:id", authontication_1.isTokenValid, (req, res) => {
    if (req.user.id === req.params.id) {
        const p = user_1.UserController.updateUser(req.params.id, req.body).pipe((0, rxjs_1.take)(1)).subscribe({
            next(r) {
                res.send(r);
            },
            error(e) {
                res.sendStatus(500);
            }
        });
    }
    else {
        res.status(403).json({ message: 'you can only update your own account' });
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.delete("/user/:id", authontication_1.isTokenValid, (req, res) => {
    if (req.user.id === req.params.id) {
        const p = user_1.UserController.deleteUser(req.params.id).pipe((0, rxjs_1.take)(1)).subscribe({
            next(r) {
                res.send(r);
            },
            error(e) {
                res.sendStatus(401);
            }
        });
    }
    else {
        res.status(403).json({ message: 'you can only delete your own account' });
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------signUp----------------------------------------------------------------------------
app.post("/product", authontication_1.isTokenValid, authontication_1.isSeller, (req, res) => {
    const p = product_1.ProductController.createProduct(req.body, req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            e === 1 ? res.status(400).json({ message: 'please provide amountAvailable ,cost and productName ' }) : res.sendStatus(400);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.put("/product/:id", authontication_1.isTokenValid, authontication_1.isSeller, (req, res) => {
    const p = product_1.ProductController.updateProduct(req.params.id, req.user.id, req.body).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            e === 1 ? res.status(403).json({ message: 'you can only delete your own products' }) : res.sendStatus(400);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.delete("/product/:id", authontication_1.isTokenValid, authontication_1.isSeller, (req, res) => {
    const p = product_1.ProductController.deleteProduct(req.params.id, req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            e === 1 ? res.status(403).json({ message: 'you can only delete your own products' }) : res.sendStatus(404);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/products/all/:pn", authontication_1.isTokenValid, (req, res) => {
    const p = product_1.ProductController.findAllProductPagination(Number(req.params.pn)).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(404);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------deposit----------------------------------------------------------------------------
app.get("/deposite/add/:coins", authontication_1.isTokenValid, authontication_1.isBuyer, (req, res) => {
    const coins = Number(req.params.coins);
    if (constants_1.COINS_ARRAY.includes(coins)) {
        const p = deposite_1.DepositeController.addCoinsToAccount(req.user.id, coins).pipe((0, rxjs_1.take)(1)).subscribe({
            next(r) {
                res.send(r);
            },
            error(e) {
                res.sendStatus(404);
            }
        });
    }
    else {
        res.status(400).json({ message: `only buyers can add coins and coins must be in ${[...constants_1.COINS_ARRAY]}` });
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/product/buy", authontication_1.isTokenValid, authontication_1.isBuyer, (req, res) => {
    const p = deposite_1.DepositeController.purchaseProduct(req.body.productId, req.body.amount, req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            switch (e) {
                case 1:
                    res.status(400).json({ message: "please add coins to your deposit" });
                    break;
                case 2:
                    res.status(400).json({ message: "amount available of this product is not enough" });
                    break;
                case 3:
                    res.status(400).json({ message: 'amount should be a whole number' });
                    break;
                case 4:
                    res.status(400).json({ message: 'this product is not exist' });
                    break;
                case 5:
                    res.status(400).json({ message: 'your account is not exist' });
                    break;
                default:
                    res.sendStatus(400);
            }
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/deposit/reset/:id", authontication_1.isTokenValid, (req, res) => {
    if (req.user.id === req.params.id) {
        const p = deposite_1.DepositeController.resetDeposit(req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
            next(r) {
                res.send(r);
            },
            error(e) {
                res.sendStatus(404);
            }
        });
    }
    else {
        res.sendStatus(403);
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connect)(process.env.MONGO_URI || "");
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
void start();
exports.default = app;
