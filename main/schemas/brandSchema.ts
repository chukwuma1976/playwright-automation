export const brandSchema = {
    type: "object",
    required: ["id", "brand"],
    properties: {
        id: { type: "number" },
        brand: { type: "string" }
    }
}