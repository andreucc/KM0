# Project Name

## Description

Consume products KM0, without carbon footprint.

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **Sign up** - As a user I want to sign up on the webpage so that I can buy products 
- **Login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **Product create** - As a user I want to create a product offer so that I can invite others to buy it
- **Product edit** - As a user I want to edit my products
- **My Product list** - As a user I want to see all my products that I want to sell
- **Users Product list** - As a user I want to see all the products that others want to sell
- **Product list** - As a user I want to see all the products available so that I can choose which ones I want
- **Product detail** - As a user I want to see the details and the choice to buy the product
- **Buy product** - As a user I want to be able to buy a product(s)
- **List seller orders** - As a user I want to see the list of my selling orders
- **List buy orders** - As a user I want to see the list of my bought products
 

## Backlog
-  Image upload
- Pretty design
- Map with coordenates
- Information about application, faqs
- Multi-list orders - cart
- Product list more visual (CRUD)
- Require Strengh password: + change password in profile view
- Payment gateway
- Control timeTable

Geo Location:
- add geolocation to vegetable garden when creating
- show all vegetable garden in a map in the event main page


## ROUTES:

- GET / 
  - renders the homepage
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - email
    - password
  - validation
    - fields not empty
    - email not exists
  - create user with encrypted password
  - store user in session
  - redirect to /seller
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - email
    - password
  - validation
    - fields not empty
    - email exists
    - passdword matches
  - store user in session
  - redirect to /seller
- POST /auth/logout
  - body: (empty)
  - redirect to /

- GET /my-products
  - renders the own product list 
  - Show buttons CRUD

-GET /my-products/create
  - Renders the product page
- POST /my-products/create 
  - body: 
    - product name
    - stock
    - price
  - validation
    - fields not empty
  - create product
  - redirect to /my-products

- POST /my-products/:idproduct/edit
  - body: 
    - stock
    - price  
  - validation
    - fields not empty
  - create product
  - redirect to /seller

-GET /incoming-orders
  - Renders my selling orders

-GET /outcoming-orders
  - Renders my buying orders

-GET /products/:idproduct
  - Renders product detail

-POST /products/:idproduct
  -body
    - product
    - quantity
  - validation
    - fields not empty
  - create Order
  - Redirect to /orders

## Models

User model
```
email: Email
password: String
Phone: Number
Location: coordenates

```

Product model
```
owner: ObjectId<User>
name: String
description: String
stock: Number
price: Number
timeTable: Enum --> 9:00 to 16:00 
available: Boolean
``` 

Order model
```
seller: ObjectId<User>
buyer: ObjectId<User>
product: ObjectId<Product>
amount: Number
``` 

## Links

Link to kanban in class

### Git

[Repository Link](http://github.com)

[Deploy Link](http://heroku.com)

### Slides

[Slides Link](http://slides.com)
