# vending-machin-flapkap


## summary


Simple vending-machine app created with node Typescript (express), rxjs and mongoDb
using Object oriented design pattern



## Installation
1 - install node
2 - npm install -g typescript
3 - npm instal
4 - npm run dev


## Usage

to be able to use the api endpoints, you will need to sign up using the POST /api/user/signup endpoint
POST /api/user/signup takes the following parameters in request body userName password role role can either be buyer or seller


# if you are a buyer:
  you can deposit money into your account using POST /api/deposite/add/:coins and the deposit should be a value from the following [5,10,20,50,100]
 
  you can reset your deposit using this end point POST /api/deposit/reset/:id
 
  you can buy a product using POST /api/product/buy which take the following parameter in the request body:
    productId the id of the product you want to buy. amount how many piece do you want
    
# if you are a seller:
  you can create a product for buyers to buy using POST /api/product/ which takes the following parameters in the request body
  productName amountAvaliable cost
 
you can delete a product using DELETE /api/product/:id which takes productId in the url query  
you can update one of your products using PUT /api/product/:id which takes the new values you want to update

# if you are a seller or a buyer :

you can delete , update your own acccount

you can get single product GET /api/product/:id or many products with pagination that being sold GET /api/products/all/:pn

you can get single user GET "/api/user/:id" or many users with pagination GET /api/users/all/:pn



