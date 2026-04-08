import { test, expect } from '@playwright/test';

test.describe('JSONPlaceholder Tests', () => {

    const baseURL = 'https://jsonplaceholder.typicode.com';

    test('GET /users', async ({ request }) => {
        const response = await request.get(`${baseURL}/users`);
        const users = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(users.length).toBeGreaterThan(0);
        expect(response.headers()['content-type']).toContain('application/json');

    });

    test('GET /users/1', async ({ request }) => {
        const response = await request.get(`${baseURL}/users/1`);
        const user = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');

        //JSON validation
        validateUser(user);
        //Nested JSON validation
        validateAddress(user.address);
        validateCompany(user.company);


    });

    test('GET invalid user', async ({ request }) => {
        const response = await request.get(`${baseURL}/users/999`);
        expect(response.status()).toBe(404);
    })

    const postIds = [1, 2, 3, 4, 5];
    postIds.forEach(postId => {
        test(`GET /posts/${postId}`, async ({ request }) => {
            const response = await request.get(`${baseURL}/posts/${postId}`);
            const newPost = await response.json();
            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);
            validatePost(newPost);
        });
    });

    test('POST /posts', async ({ request }) => {
        const newPost = {
            "userId": 1,
            "title": "just a test title",
            "body": "just a test body"
        }

        const response = await request.post(`${baseURL}/posts`, { data: newPost })
        const createdPost = await response.json();
        expect(response.status()).toBe(201);

        validatePost(createdPost);
        expect(createdPost).toMatchObject(newPost);

    });

    test('PUT /posts/1', async ({ request }) => {
        const post = await request.get(`${baseURL}/posts/1`);
        const originalPost = await post.json()
        const updatedPost = { ...originalPost, title: 'updated title', body: 'updated body' };
        const response = await request.put(`${baseURL}/posts/1`, { data: updatedPost });

        const responseData = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(responseData).toMatchObject(updatedPost);

    });

    test('DELETE /posts/1', async ({ request }) => {
        const response = await request.delete(`${baseURL}/posts/1`);
        expect(response.status()).toBe(200);
    });

});

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: object;
    phone: string;
    website: string;
    company: object;
};

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

function validateUser(user: User) {
    expect(user).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        address: expect.any(Object),
        phone: expect.any(String),
        website: expect.any(String),
        company: expect.any(Object)
    })
}

function validateAddress(address: any) {
    expect(address).toMatchObject({
        street: expect.any(String),
        suite: expect.any(String),
        city: expect.any(String),
        zipcode: expect.any(String),
        geo: expect.any(Object)
    })
}

function validateCompany(company: any) {
    expect(company).toMatchObject({
        name: expect.any(String),
        catchPhrase: expect.any(String),
        bs: expect.any(String)
    })
}

function validatePost(post: Post) {
    expect(post).toMatchObject({
        userId: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
        id: expect.any(Number)
    })
}