export const credentials = {
    email: "dummy@login.com",
    password: "password123"
}

export const listOfInvalidOrMissingCredentials = [
    {
        email: "dummy@login.com",
        password: ""
    },
    {
        email: "",
        password: "password123"
    },
    {
        email: "",
        password: ""
    },
    {
        email: "dummy@login.com",
        password: "invalidpassword"
    },
    {
        email: "invalid@login.com",
        password: "password123"
    },
    {
        email: "invalid@login.com",
        password: "invalidpassword"
    }
]

export const invalidCredentials = {
    email: "invalid@login.com",
    password: "invalidpassword"
}

export const blankLoginCredentials = [
    {
        email: "",
        password: "password123"
    },
    {
        email: "dummy@login.com",
        password: ""
    },
    {
        email: "",
        password: ""
    },
]