import { test, expect } from '@playwright/test';
import { Ajv } from 'ajv';
import { userPayload } from '../../main/utilities/testDataGenerator';

test.describe('JSONPlaceholder Tests', () => {

    const baseURL = 'https://jsonplaceholder.typicode.com';

    test('GET /users', async ({ request }) => {
        const response = await request.get(`${baseURL}/users`);
        const users = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(users.length).toBe(10);
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

    test("POST users", async ({ request }) => {
        const response = await request.post(`${baseURL}/users`, { data: userPayload });
        expect(response.status()).toBe(201);
        const result = await response.json();
        expect(result.id).toBeTruthy();
    })

    test("PUT users returns server error", async ({ request }) => {
        const res = await request.post(`${baseURL}/users/`, { data: userPayload });
        const user = await res.json();
        const updatedPayload = { ...user, name: "Benjamin Reilly", username: "The Spider" };
        const response = await request.put(`${baseURL}/users/${user.id}`, { data: updatedPayload });
        expect(response.status()).toBe(500);
    })

    test("PATCH users", async ({ request }) => {
        const res = await request.post(`${baseURL}/users/`, { data: userPayload });
        const user = await res.json();
        const patchPayload = { name: "Benjamin Reilly", username: "The Spider" };
        const response = await request.patch(`${baseURL}/users/${user.id}`, { data: patchPayload });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.name).toBe("Benjamin Reilly");
        expect(result.username).toBe("The Spider");
    })

    test("DELETE users", async ({ request }) => {
        const res = await request.post(`${baseURL}/users/`, { data: userPayload });
        const user = await res.json();
        const response = await request.delete(`${baseURL}/users/${user.id}`);
        expect(response.status()).toBe(200);
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

    test('GET /posts/1 with ajv validation', async ({ request }) => {
        const expectedResponse = {
            userId: 1,
            id: 1,
            title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
            body: 'quia et suscipit\n' +
                'suscipit recusandae consequuntur expedita et cum\n' +
                'reprehenderit molestiae ut ut quas totam\n' +
                'nostrum rerum est autem sunt rem eveniet architecto'
        }

        const response = await request.get(`${baseURL}/posts/1`);
        const newPost = await response.json();

        // Status validation
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        // Content validation
        expect(newPost).toMatchObject(expectedResponse);

        // Schema validation
        const schema = {
            type: "object",
            required: ["userId", "id", "title", "body"],
            properties: {
                userId: { type: "number" },
                id: { type: "number" },
                title: { type: "string" },
                body: { type: "string" }
            }
        };

        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(newPost);
        expect(valid).toBeTruthy();
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

    test('GET /comments', async ({ request }) => {
        const response = await request.get(`${baseURL}/comments`);
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.length).toBe(500);
    });

    test('GET /comments/1', async ({ request }) => {
        const response = await request.get(`${baseURL}/comments/1`);
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result).toMatchObject({
            postId: expect.any(Number),
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            body: expect.any(String)
        })
    });

    test('POST /comments', async ({ request }) => {
        const payload = {
            postId: 1,
            name: 'A new comment',
            email: 'Eliseo@gardner.biz',
            body: 'I am speechless'
        }
        const response = await request.post(`${baseURL}/comments`, { data: payload });
        expect(response.status()).toBe(201);
        const result = await response.json();
        expect(result.id).toBeTruthy();

        // Also test delete
        const res = await request.delete(`${baseURL}/comments/${result.id}`);
        expect(res.status()).toBe(200);
    });


    test('PUT /comments/1', async ({ request }) => {
        const payload = {
            postId: 1,
            id: 1,
            name: 'Updated name',
            email: 'Eliseo@gardner.biz',
            body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\n' +
                'tempora quo necessitatibus\n' +
                'dolor quam autem quasi\n' +
                'reiciendis et nam sapiente accusantium'
        }
        const response = await request.put(`${baseURL}/comments/1`, { data: payload });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.name).toBe("Updated name");
    });

    test('PATCH /comments/1', async ({ request }) => {
        const payload = { name: 'Updated name' };
        const response = await request.put(`${baseURL}/comments/1`, { data: payload });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.name).toBe("Updated name");
    });

    test('GET /albums', async ({ request }) => {
        const response = await request.get(`${baseURL}/albums`);
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.length).toBe(100);
    })

    test('GET /albums/1', async ({ request }) => {
        const response = await request.get(`${baseURL}/albums/1`);
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result).toMatchObject({
            userId: expect.any(Number),
            id: expect.any(Number),
            title: expect.any(String)
        })
    })

    test('POST /albums', async ({ request }) => {
        const payload = { userId: 1, title: 'CA Smooth Vibes Album' };
        const response = await request.post(`${baseURL}/albums`, { data: payload });
        expect(response.status()).toBe(201);
        const result = await response.json();
        expect(result.id).toBeTruthy();

        // Also test delete
        const res = await request.delete(`${baseURL}/albums/${result.id}`);
        expect(res.status()).toBe(200);
    })

    test('PUT /albums', async ({ request }) => {
        const payload = { userId: 1, id: 1, title: 'CA Smooth Vibes Album' };
        const response = await request.put(`${baseURL}/albums/1`, { data: payload });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.title).toBe('CA Smooth Vibes Album');
    })

    test('PATCH /albums', async ({ request }) => {
        const payload = { title: 'CA Smooth Vibes Album' };
        const response = await request.patch(`${baseURL}/albums/1`, { data: payload });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.title).toBe('CA Smooth Vibes Album');
    })

    test('GET /photos', async ({ request }) => {
        const response = await request.get(`${baseURL}/photos`);
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.length).toBe(5000);
    })

    test('GET /photos/1', async ({ request }) => {
        const response = await request.get(`${baseURL}/photos/1`);
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result).toMatchObject({
            albumId: expect.any(Number),
            id: expect.any(Number),
            title: expect.any(String),
            url: expect.any(String),
            thumbnailUrl: expect.any(String)
        })
    })

    test('POST /photos', async ({ request }) => {
        const payload = {
            albumId: 1,
            title: 'Album Photo',
            url: 'https://via.placeholder.com/600/92c952',
            thumbnailUrl: 'https://via.placeholder.com/150/92c952'
        };
        const response = await request.post(`${baseURL}/photos`, { data: payload });
        expect(response.status()).toBe(201);
        const result = await response.json();
        expect(result.id).toBeTruthy();

        // Also test delete
        const res = await request.delete(`${baseURL}/photos/${result.id}`);
        expect(res.status()).toBe(200);
    })

    test('PUT /photos', async ({ request }) => {
        const payload = {
            albumId: 1,
            id: 1,
            title: 'My Album Photo',
            url: 'https://via.placeholder.com/600/92c952',
            thumbnailUrl: 'https://via.placeholder.com/150/92c952'
        };
        const response = await request.put(`${baseURL}/photos/1`, { data: payload });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.title).toBe('My Album Photo');
    })

    test('PATCH /photos', async ({ request }) => {
        const payload = { title: 'My Album Photo' };
        const response = await request.patch(`${baseURL}/photos/1`, { data: payload });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.title).toBe('My Album Photo');
    })

    //
    test('GET /todos', async ({ request }) => {
        const response = await request.get(`${baseURL}/todos`);
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.length).toBe(200);
    })

    test('GET /todos/1', async ({ request }) => {
        const response = await request.get(`${baseURL}/todos/1`);
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result).toMatchObject({
            userId: expect.any(Number),
            id: expect.any(Number),
            title: expect.any(String),
            completed: expect.any(Boolean)
        })
    })

    test('POST /todos', async ({ request }) => {
        const payload = { userId: 1, title: 'Something to do', completed: false };
        const response = await request.post(`${baseURL}/todos`, { data: payload });
        expect(response.status()).toBe(201);
        const result = await response.json();
        expect(result.id).toBeTruthy();

        // Also test delete
        const res = await request.delete(`${baseURL}/todos/${result.id}`);
        expect(res.status()).toBe(200);
    })

    test('PUT /todos', async ({ request }) => {
        const payload = { userId: 1, id: 1, title: 'Something to do', completed: false };
        const response = await request.put(`${baseURL}/todos/1`, { data: payload });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.title).toBe('Something to do');
    })

    test('PATCH /todos', async ({ request }) => {
        const payload = { title: 'Something to do' };
        const response = await request.patch(`${baseURL}/todos/1`, { data: payload });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.title).toBe('Something to do');
    })
});

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: object;
    phone: string;
    website: string;
    company: object;
};

interface Post {
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