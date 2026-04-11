export function generateUserCredentials() {
    const timestamp = Date.now();
    const email = `testUser${timestamp}@email.com`;
    const password = `testPassword@${timestamp}`;
    return { email, password };
}

export function generateUserToRegister() {
    const { email, password } = generateUserCredentials();
    return generateUser(email, password);
}

export function generateUserWithExistingEmail() {
    return {
        name: "tester",
        email: "dummy@login.com",
    };
}

export function generateUser(email: string, password: string) {
    return {
        name: "testUser",
        email: email,
        password: password,
        title: "Mr",
        birth_date: "1",
        birth_month: "January",
        birth_year: "2000",
        firstname: "Test",
        lastname: "User",
        company: "Testing INC",
        address1: "Testing Street",
        address2: "Apt 2",
        country: "United States",
        zipcode: "11111",
        state: "Texas",
        city: "Dallas",
        mobile_number: "123456789"
    };
}