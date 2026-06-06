export const countrySchema = {
    type: "object",
    required: [
        "code",
        "capital",
        "currency",
        "phone",
        "emoji",
        "name"
    ],
    properties: {
        code: {
            type: "string",
            minLength: 2,
            maxLength: 2
        },
        capital: {
            type: ["string", "null"]
        },
        currency: {
            type: ["string", "null"]
        },
        phone: {
            type: "string"
        },
        emoji: {
            type: "string"
        },
        name: {
            type: "string"
        }
    }
};

export const countriesSchema = {
    type: "array",
    items: countrySchema
};