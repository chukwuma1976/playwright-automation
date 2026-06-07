import test, { expect, type APIRequestContext } from "@playwright/test"
import { Ajv } from "ajv";
import { countriesSchema, countrySchema } from "../../main/schemas/countrySchema";

test.describe("Demonstrate graphQL", () => {
    const ajv = new Ajv();

    test("Get country information using GraphQL endpoint", async ({ request }) => {
        const countryResponse = await getCountryDetails(request, "US");
        expect(countryResponse.status()).toBe(200);

        const countryDetails = await countryResponse.json();
        const country = countryDetails.data.country;
        const validate = ajv.compile(countrySchema);
        expect(validate(country)).toBeTruthy();

    })

    test("Get all countries using GraphQL endpoint", async ({ request }) => {
        const countriesResponse = await getAllCountries(request);
        expect(countriesResponse.status()).toBe(200);

        const countries = await countriesResponse.json();
        const countriesArray = countries.data.countries;
        const validate = ajv.compile(countriesSchema);
        expect(validate(countriesArray)).toBeTruthy();
        console.table(countriesArray, ["code", "name", "capital", "currency"]);
    })

    async function getCountryDetails(request: APIRequestContext, code: string) {
        return await request.post(
            "https://countries.trevorblades.com/graphql",
            {
                data: {
                    query: `
                    query {
                        country(code: "${code}") {
                            code
                            name
                            capital
                            currency
                            phone
                            emoji
                        }
                    }
                    `
                }
            }
        );
    }

    async function getAllCountries(request: APIRequestContext) {
        return await request.post(
            "https://countries.trevorblades.com/graphql",
            {
                data: {
                    query: `
                    query {
                        countries {
                            code
                            name
                            capital
                            currency
                            phone
                            emoji
                        }
                    }
                    `
                }
            }
        );
    }

})