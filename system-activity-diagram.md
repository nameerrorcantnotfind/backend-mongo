# E-Commerce System Activity Diagrams

This document contains PlantUML activity diagrams for the main flows in the e-commerce system.

## Authentication Flow

```plantuml
@startuml Authentication Flow
title Authentication Flow

start
fork
  :User Registration;
  :Enter Name, Email, Password, Phone, Address;
  :Submit Registration Form;
  if (Email already exists?) then (yes)
    :Return Error: User already exists;
    stop
  else (no)
    :Hash Password;
    :Create New User;
    :Generate JWT Token;
    :Return Token to Client;
  endif
fork again
  :User Login;
  :Enter Email and Password;
  :Submit Login Form;
  if (User exists?) then (no)
    :Return Error: User not found;
    stop
  else (yes)
    if (Password matches?) then (no)
      :Return Error: Invalid credentials;
      stop
    else (yes)
      :Generate JWT Token;
      :Return User Data and Token;
    endif
  endif
end fork
:Store Token in Client;
:Redirect to Home Page;
stop
@enduml
```

## Product Browsing Flow

```plantuml
@startuml Product Browsing Flow
title Product Browsing Flow

start
:User Visits Product Page;
:System Fetches Products;
fork
  :View All Products;
  :Display Product List;
fork again
  :Filter by Category;
  :Display Filtered Products;
fork again
  :Search Products;
  :Display Search Results;
fork again
  :View Product Details;
  :Fetch Product by ID;
  :Display Product Details;
end fork
stop
@enduml
```

## Cart Management Flow

```plantuml
@startuml Cart Management Flow
title Cart Management Flow

start
:User Authentication Required;
note right: JWT Token Verification

fork
  :Add Product to Cart;
  if (Product exists?) then (no)
    :Return Error: Product not found;
    stop
  else (yes)
    if (Quantity > 0?) then (no)
      :Return Error: Invalid quantity;
      stop
    else (yes)
      if (Product already in cart?) then (yes)
        :Calculate New Total Quantity;
      else (no)
        :Create New Cart Item;
      endif
      if (Enough stock available?) then (no)
        :Return Error: Not enough stock;
        stop
      else (yes)
        :Save Cart Item;
        :Return Success Response;
      endif
    endif
  endif
fork again
  :Update Cart Item;
  if (Product in cart?) then (no)
    :Return Error: Product not in cart;
    stop
  else (yes)
    if (Product still exists?) then (no)
      :Return Error: Product no longer exists;
      stop
    else (yes)
      if (New Quantity <= 0?) then (yes)
        :Remove Item from Cart;
      else (no)
        if (Enough stock available?) then (no)
          :Return Error: Not enough stock;
          stop
        else (yes)
          :Update Cart Item Quantity;
        endif
      endif
    endif
  endif
fork again
  :Remove Product from Cart;
  if (Product in cart?) then (no)
    :Return Error: Product not in cart;
    stop
  else (yes)
    :Delete Cart Item;
  endif
fork again
  :View Cart;
  :Fetch User's Cart Items;
  :Check if Products Still Exist;
  :Return Cart Items with Product Details;
end fork
stop
@enduml
```

## Order Management Flow

```plantuml
@startuml Order Management Flow
title Order Management Flow

start
:User Authentication Required;
note right: JWT Token Verification

fork
  :Create Order;
  :Fetch User's Cart Items;
  if (Cart is empty?) then (yes)
    :Return Error: Cart is empty;
    stop
  else (no)
    :Process Each Cart Item;
    while (More items in cart?) is (yes)
      :Check Product Existence;
      if (Product exists?) then (no)
        :Return Error: Product not found;
        stop
      else (yes)
        :Check Stock Availability;
        if (Enough stock?) then (no)
          :Return Error: Not enough stock;
          stop
        else (yes)
          :Add to Order Items;
          :Calculate Total Price;
          :Update Product Stock;
        endif
      endif
    endwhile (no)
    :Create New Order;
    :Save Order;
    :Clear User's Cart;
    :Return Order Details;
  endif
fork again
  :View Orders;
  if (User is Admin?) then (yes)
    :Fetch All Orders;
  else (no)
    :Fetch User's Orders;
  endif
  :Return Orders List;
fork again
  :View Order Details;
  :Fetch Order by ID;
  if (Order exists?) then (no)
    :Return Error: Order not found;
    stop
  else (yes)
    if (User is Admin or Order Owner?) then (no)
      :Return Error: Not authorized;
      stop
    else (yes)
      :Return Order Details;
    endif
  endif
fork again
  :Update Order Status;
  if (User is Admin?) then (no)
    :Return Error: Only admins can update status;
    stop
  else (yes)
    :Fetch Order by ID;
    if (Order exists?) then (no)
      :Return Error: Order not found;
      stop
    else (yes)
      if (Status is valid?) then (no)
        :Return Error: Invalid status;
        stop
      else (yes)
        if (Order already delivered?) then (yes)
          :Return Error: Cannot change delivered order;
          stop
        else (no)
          :Update Order Status;
          :Save Order;
          :Return Updated Order;
        endif
      endif
    endif
  endif
end fork
stop
@enduml
```

## User Profile Management Flow

```plantuml
@startuml User Profile Flow
title User Profile Management Flow

start
:User Authentication Required;
note right: JWT Token Verification

fork
  :View Profile;
  :Fetch User by ID from Token;
  :Remove Password from Response;
  :Return User Profile;
fork again
  :Update Profile;
  :Fetch User by ID from Token;
  if (No data provided?) then (yes)
    :Return Error: No data for update;
    stop
  else (no)
    if (Email already in use?) then (yes)
      :Return Error: Email already in use;
      stop
    else (no)
      :Update User Information;
      :Save User;
      :Return Updated Profile;
    endif
  endif
fork again
  :Change Password;
  :Fetch User by ID from Token;
  if (Current and New Password provided?) then (no)
    :Return Error: Both passwords required;
    stop
  else (yes)
    if (Current Password correct?) then (no)
      :Return Error: Incorrect password;
      stop
    else (yes)
      :Hash New Password;
      :Update User Password;
      :Save User;
      :Return Success Response;
    endif
  endif
end fork
stop
@enduml
```

## System Overview Diagram

```plantuml
@startuml System Overview
title E-Commerce System Overview

actor "Customer" as customer
actor "Admin" as admin
rectangle "Authentication" as auth
rectangle "Product Management" as product
rectangle "Cart Management" as cart
rectangle "Order Management" as order
rectangle "User Profile" as profile
database "MongoDB" as db

customer --> auth : Register/Login
admin --> auth : Login
auth --> db : Store/Verify User

customer --> product : Browse Products
admin --> product : Manage Products
product --> db : CRUD Operations

customer --> cart : Manage Cart
cart --> db : Store Cart Items

customer --> order : Place/View Orders
admin --> order : Manage Orders
order --> db : Store/Update Orders

customer --> profile : View/Update Profile
profile --> db : Store User Data

@enduml
```

## Database Relationship Diagram

```plantuml
@startuml Database Relationships
title Database Relationships

entity "User" as user {
  * _id : ObjectId
  --
  * name : String
  * email : String
  phone : String
  address : String
  * password : String
  * isAdmin : Boolean
  orders : [ObjectId]
  cartItems : [ObjectId]
  * createdAt : Date
  * updatedAt : Date
}

entity "Product" as product {
  * _id : ObjectId
  --
  * name : String
  * pictureURL : String
  feature : [String]
  description : String
  * price : Number
  * amountInStore : Number
  * category : ObjectId
  orderItems : [ObjectId]
  cartItems : [ObjectId]
  * createdAt : Date
  * updatedAt : Date
}

entity "Category" as category {
  * _id : ObjectId
  --
  * name : String
  products : [ObjectId]
  * createdAt : Date
  * updatedAt : Date
}

entity "Cart" as cart {
  * _id : ObjectId
  --
  * productId : ObjectId
  * userId : ObjectId
  * quantity : Number
  * createdAt : Date
  * updatedAt : Date
}

entity "Order" as order {
  * _id : ObjectId
  --
  * user : ObjectId
  * items : [{
    product : ObjectId,
    quantity : Number
  }]
  * totalPrice : Number
  * status : String
  paymentDate : Date
  * createdAt : Date
  * updatedAt : Date
}

user ||--o{ cart : has
user ||--o{ order : places
product ||--o{ cart : contains
category ||--o{ product : has
product }o--o{ order : included in

@enduml
```

## How to Use These Diagrams

1. Copy the PlantUML code for the diagram you want to visualize
2. Paste it into a PlantUML editor or renderer
3. Generate the diagram

You can use online PlantUML editors like:
- [PlantUML Online Server](https://www.plantuml.com/plantuml/uml/)
- [PlantText](https://www.planttext.com/)

Or use extensions in your IDE:
- VS Code: PlantUML extension
- JetBrains IDEs: PlantUML integration plugin

## Notes on the System Architecture

The system follows a typical MVC (Model-View-Controller) architecture with:

1. **Models**: MongoDB schemas for User, Product, Category, Cart, and Order
2. **Controllers**: Handle HTTP requests and responses
3. **Services**: Contain business logic and database operations
4. **Routes**: Define API endpoints and connect them to controllers
5. **Middleware**: Handle authentication and other cross-cutting concerns

The system uses JWT for authentication and authorization, with different access levels for regular users and administrators.
