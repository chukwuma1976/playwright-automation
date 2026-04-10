export const productSchema = {
    type: "object",
    required: ["name", "price", "brand", "category"],
    properties: {
        name: { type: "string" },
        price: { type: "string" },
        brand: { type: "string" },
        category: {
            type: "object",
            required: ["usertype", "category"],
            properties: {
                usertype: {
                    type: "object",
                    required: ["usertype"],
                    properties: {
                        usertype: { type: "string" }
                    }
                },
                category: { type: "string" }
            }
        }
    }
};