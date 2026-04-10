export const credentials = {
    email: "dummy@login.com",
    password: "password123"
}

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