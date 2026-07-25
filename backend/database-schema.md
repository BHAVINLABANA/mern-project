# Multi-Tenant E-Commerce Database Schema

## Collections

### Users
- _id
- name
- email
- password
- role (Super Admin, Vendor, Customer)

### Stores
- _id
- vendorId
- storeName
- description
- logo

### Products
- _id
- storeId
- name
- description
- price
- stock
- images
- categoryId

### Categories
- _id
- name

### Cart
- _id
- customerId
- products[]

### Orders
- _id
- customerId
- products[]
- totalAmount
- paymentStatus
- orderStatus

### Reviews
- _id
- productId
- customerId
- rating
- comment

---

## Relationships

Vendor → Owns → Store

Store → Has Many → Products

Product → Belongs To → Category

Customer → Has → Cart

Customer → Places → Orders

Order → Contains → Products