export const generateTaskToAdd = (): { [key: string]: string } => {
    const title = `Task ${Date.now()}`;
    const categories = ["Work", "Personal", "Home"];
    const index = Math.floor(Math.random()) * 3;
    const category = categories[index];
    const description = `Add a task using under ${category}`;
    return {
        title,
        description,
        category,
    }
}

export const keyPresses = [
    { "F1": "You entered: F1" },
    { "F12": "You entered: F12" },
    { "Digit1": "You entered: 1" },
    { "Digit9": "You entered: 9" },
    { "KeyA": "You entered: A" },
    { "KeyZ": "You entered: Z" },
    { "Backquote": "You entered: BACK_QUOTE" },
    { "Backslash": "You entered: BACK_SLASH" },
    { "Backspace": "You entered: BACK_SPACE" },
    { "Tab": "You entered: TAB" },
    { "Delete": "You entered: DELETE" },
    { "Escape": "You entered: ESCAPE" },
    { "ArrowDown": "You entered: DOWN" },
    { "ArrowUp": "You entered: UP" },
    { "ArrowRight": "You entered: RIGHT" },
    { "ArrowLeft": "You entered: LEFT" },
    { "End": "You entered: END" },
    { "Home": "You entered: HOME" },
    { "Insert": "You entered: INSERT" },
    { "PageDown": "You entered: PAGE_DOWN" },
    { "PageUp": "You entered: PAGE_UP" },
    { "Shift": "You entered: SHIFT" },
    { "Control": "You entered: CONTROL" },
    { "Alt": "You entered: ALT" },
]


export const mockRoomsApiResponse = {
    "rooms": [
        {
            "roomid": 1,
            "roomName": "101",
            "type": "Single",
            "roomPrice": 100,
            "accessible": true,
            "image": "/images/room1.jpg",
            "description": "A cozy and compact space perfect for solo travelers. Features a comfortable twin bed, a dedicated workspace, and large windows that offer plenty of natural light.",
            "features": ["WiFi", "TV", "Coffee Maker", "Accessible Bathroom"]
        },
        {
            "roomid": 2,
            "roomName": "102",
            "type": "Double",
            "roomPrice": 150,
            "accessible": true,
            "image": "/images/room2.jpg",
            "description": "Spacious and modern, this room features a comfortable queen-sized bed, a small seating area, and elegant decor. Ideal for couples or business partners.",
            "features": ["WiFi", "TV", "Mini Fridge", "Air Conditioning", "Wheelchair Accessible"]
        },
        {
            "roomid": 3,
            "roomName": "103",
            "type": "Suite",
            "roomPrice": 225,
            "accessible": true,
            "image": "/images/room3.jpg",
            "description": "Our premium luxury suite offering a separate living area, a plush king-sized bed, and panoramic city views. Designed with extra wide clearance for maximum accessibility.",
            "features": ["WiFi", "Smart TV", "Mini Bar", "Safe", "Step-free Shower"]
        }
    ]
}

export const bookingData = {
    roomid: 3,
    firstname: 'Automation',
    lastname: 'Tester',
    depositpaid: false,
    bookingdates: {
        checkin: '2026-06-16',
        checkout: '2026-06-17'
    },
    email: 'automation.tester@gmail.com',
    phone: '+1 (800) 600-8000'
};

export const mockBookingApiResponse = {
    bookingdates: { checkin: '2026-06-16', checkout: '2026-06-17' },
    bookingid: 6,
    depositpaid: false,
    firstname: 'Automation',
    lastname: 'Tester',
    roomid: 3
}

export const mockStandardRoom = {
    roomName: '104',
    type: 'Double',
    roomPrice: 160,
    accessible: true,
    image: "/images/room2.jpg",
    description: 'A spacious and well-lit double room featuring modern amenities, perfect for couples or small families.',
    features: ['TV', 'Radio', 'Safe', 'WiFi']
};

export const mockPremiumRoom = {
    roomName: '501',
    type: 'Suite',
    roomPrice: 450,
    accessible: false,
    image: "/images/room3.jpg",
    description: 'An exclusive top-floor penthouse suite boasting panoramic views, a private lounge area, and premium finishes.',
    features: ['TV', 'Radio', 'Safe', 'WiFi', 'Mini Bar', 'Air Conditioning', 'Jacuzzi']
};

export const mockMinimalRoom = {
    roomName: '99',
    type: 'Single',
    roomPrice: 75,
    accessible: true,
    image: "/images/room2.jpg",
    description: 'A minimalist single bed layout designed for solo travelers on a budget.',
    features: ['WiFi']
};

export const bookerAdminLoginPayload = {
    username: "admin",
    password: "password"
}

export const userPayload = {
    "id": 1,
    "name": "Ben Reilly",
    "username": "spider Noir",
    "email": "ben.reilly@gmail.com",
    "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "New York",
        "zipcode": "92998-3874",
        "geo": {
            "lat": "-37.3159",
            "lng": "81.1496"
        }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "reillydetective.org",
    "company": {
        "name": "Reilly Detective Agency",
        "catchPhrase": "With no power there is not responsibility",
        "bs": "Catch the bad guys"
    }
}