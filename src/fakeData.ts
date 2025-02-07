
export const fakeData = {
    categories: [
        {
            id: 37,
            name: "STW-G-M-5",
            cars: ["IYH 1234", "IYH 1235", "KNZ 1236"]
        }
    ],
    bookings: [
        {
            id: 1,
            website_booking_id: 1,
            user_id: "1234567890",
            category_id: 37,
            category_name: null,
            car_license: "IYH 1234",
            drivers: null,
            driversNames: ["1234567890"],
            start: "2025-02-02T12:20:00",
            end: "2025-02-13T16:00:00",
            price: 16.13,
            status: "FINISHED",
            startLocation: "Office",
            endLocation: "Office",
            externalCar: false
        },
        {
            id: 2,
            website_booking_id: 2,
            user_id: "0987654321",
            category_id: 37,
            category_name: null,
            car_license: "IYH 1235",
            drivers: null,
            driversNames: ["0987654321"],
            start: "2025-01-12T11:30:00",
            end: "2025-02-04T11:30:00",
            price: 96.77,
            status: "FINISHED",
            startLocation: "Office",
            endLocation: "Office",
            externalCar: false
        }
    ]
};