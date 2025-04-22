# E-Commerce System Class Diagram

This document contains a PlantUML class diagram focusing on the data models of the e-commerce system and their relationships.

## Models Class Diagram

```plantuml
@startuml E-Commerce Models Class Diagram

' Display configuration
skinparam classAttributeIconSize 0
skinparam classFontStyle bold
skinparam classBackgroundColor #f0f8ff
skinparam classBorderColor #4682b4
skinparam arrowColor #4682b4
skinparam linetype polyline
skinparam nodesep 100
skinparam ranksep 80
skinparam padding 10
skinparam roundcorner 15
skinparam shadowing true
skinparam handwritten false
skinparam monochrome false
skinparam defaultFontName Arial
skinparam defaultFontSize 14

' Define models
class User {
  - _id: ObjectId
  - name: String
  - email: String
  - phone: String
  - address: String
  - password: String
  - isAdmin: Boolean
  - orders: [ObjectId]
  - cartItems: [ObjectId]
  - createdAt: Date
  - updatedAt: Date
  ..
  + getUserProfile()
  + updateProfile()
  + changePassword()
}

class Product {
  - _id: ObjectId
  - name: String
  - pictureURL: String
  - feature: [String]
  - description: String
  - price: Number
  - amountInStore: Number
  - category: ObjectId
  - orderItems: [ObjectId]
  - cartItems: [ObjectId]
  - createdAt: Date
  - updatedAt: Date
  ..
  + checkStock()
  + updateStock()
}

class Category {
  - _id: ObjectId
  - name: String
  - products: [ObjectId]
  - createdAt: Date
  - updatedAt: Date
  ..
  + getProducts()
}

class Cart {
  - _id: ObjectId
  - productId: ObjectId
  - userId: ObjectId
  - quantity: Number
  - createdAt: Date
  - updatedAt: Date
  ..
  + updateQuantity()
  + calculateSubtotal()
}

class Order {
  - _id: ObjectId
  - user: ObjectId
  - items: [{
    product: ObjectId,
    quantity: Number
  }]
  - totalPrice: Number
  - status: String
  - paymentDate: Date
  - createdAt: Date
  - updatedAt: Date
  ..
  + calculateTotal()
  + updateStatus()
}

' Define relationships
User "1" -- "0..*" Order : places >
note on link
  User places many orders
end note

User "1" -- "0..*" Cart : has >
note on link
  User has many cart items
end note

Product "1" -- "0..*" Cart : contained in >
note on link
  A product can be in many carts
end note

Category "1" -- "0..*" Product : has >
note on link
  A category has many products
end note

Product "1..*" -- "0..*" Order : included in >
note on link
  Many products can be in many orders
end note

' Layout arrangement
User -[hidden]right- Product
Product -[hidden]right- Category
Cart -[hidden]down- Order

@enduml
```

## Detailed Model Descriptions

### User Model
- Represents a user in the system
- Contains personal information (name, email, phone, address)
- Stores authentication information (password, admin rights)
- References to orders and cart items
- Methods:
  - `getUserProfile()`: Retrieves user profile information
  - `updateProfile()`: Updates personal information
  - `changePassword()`: Changes user password

### Product Model
- Represents a purchasable product
- Contains product details (name, image, features, description, price)
- Tracks inventory with amountInStore
- Belongs to a category
- References to orders and carts containing this product
- Methods:
  - `checkStock()`: Checks available inventory
  - `updateStock()`: Updates inventory quantity

### Category Model
- Represents a product category
- Contains a category name
- References to products in this category
- Methods:
  - `getProducts()`: Gets list of products in the category

### Cart Model
- Represents an item in a user's shopping cart
- Links a user to a product with a specific quantity
- Used for temporary storage before creating an order
- Methods:
  - `updateQuantity()`: Updates product quantity
  - `calculateSubtotal()`: Calculates total value of the cart item

### Order Model
- Represents a completed purchase
- Contains a reference to the user who placed the order
- Contains a list of items (products and quantities)
- Tracks the total price
- Tracks the order status (pending, processing, shipped, delivered, completed)
- Records payment date
- Methods:
  - `calculateTotal()`: Calculates total order value
  - `updateStatus()`: Updates order status

## Model Relationships

1. **User to Order**: One-to-Many. A user can place multiple orders, but each order belongs to exactly one user.

2. **User to Cart**: One-to-Many. A user can have multiple items in their cart, but each cart item belongs to exactly one user.

3. **Product to Cart**: One-to-Many. A product can be in multiple users' carts, but each cart item refers to exactly one product.

4. **Category to Product**: One-to-Many. A category can contain multiple products, but each product belongs to exactly one category.

5. **Product to Order**: Many-to-Many. A product can be included in multiple orders, and an order can contain multiple products. This relationship is implemented through the items array in the Order model.

## How to Use This Class Diagram

1. Copy the PlantUML code
2. Paste it into a PlantUML editor or renderer
3. Generate the diagram

You can use online PlantUML editors like:
- [PlantUML Online Server](https://www.plantuml.com/plantuml/uml/)
- [PlantText](https://www.planttext.com/)

Or use extensions in your IDE:
- VS Code: PlantUML extension
- JetBrains IDEs: PlantUML integration plugin

## Benefits of the Class Diagram

1. **Data Structure Visualization**: Helps understand the objects in the system and relationships between them
2. **Design Documentation**: Provides clear documentation of data structures for the development team
3. **Development Support**: Serves as a foundation for code implementation
4. **Easy Expansion**: Helps identify ways to extend the system in the future
5. **Effective Communication**: Facilitates effective communication between team members
