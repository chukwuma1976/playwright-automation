export interface Product {
    name: String,
    price: String,
    brand: String,
    category: {
        usertype: {
            usertype: String
        },
        category: String
    }
}