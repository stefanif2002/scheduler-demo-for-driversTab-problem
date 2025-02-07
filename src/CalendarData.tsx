// CalendarData.tsx
import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import {myApi} from "./service";
import {fakeData} from "./fakeData";


export interface CalendarData {
    events: any[];
    resources: any[];
    categories: { text: string; value: string }[];
    fetchBookings: (query?: any) => void;
}

export const useCalendarData = (searchParams: any): CalendarData => {
    const [events, setEvents] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [categories, setCategories] = useState<{ text: string; value: string }[]>([]);

    const processBookings = (data: any) => {
        const resourceList: any[] = [];
        const eventList: any[] = [];
        const categoryOptions: { text: string; value: string }[] = [];
        const now = dayjs();

        // Create category resources
        const categoryMap = new Map();
        data.categories.forEach((category: any) => {
            const rawName = category.name === "UNASSIGNED" ? "UNASSIGNED" : `${category.name}`;
            // name is the display name that will be shown in the UI
            const displayName = category.name === "UNASSIGNED" ? "UNASSIGNED" : `Category: ${category.name}`;

            categoryOptions.push({ text: category.name, value: category.id.toString() });

            const categoryResource = {
                id: category.id,
                rawName: rawName,    // Saved in the map for lookup
                name: displayName,   // Displayed in the scheduler
                expanded: true,
                children: [] as any[],
            };
            categoryMap.set(category.id, categoryResource);
            resourceList.push(categoryResource);
        });

        // Create car resources and deduplicate car licenses.
        data.categories.forEach((category: any) => {
            const uniqueCarLicenses = Array.from(new Set(category.cars));
            uniqueCarLicenses.forEach((carLicense: string) => {
                const carResource = {
                    id: carLicense, // license is unique after deduplication
                    name: carLicense === "" ? "UNASSIGNED" : `Car: ${carLicense}`,
                    parentId: category.id,
                };
                categoryMap.get(category.id).children.push(carResource);
            });
        });

        //console.log(categoryMap)

        // Create event list
        data.bookings.forEach((booking: any) => {
            //console.log(booking.category_id)
            //console.log(categoryMap.get(booking.category_id))

            const event = {id: booking.id.toString(),
                resourceId: booking.car_license, // should match one of the car resource ids
                startDate: new Date(booking.start),
                endDate: new Date(booking.end),
                name: `RES-${booking.website_booking_id || "Unknown"}`,
                website_booking_id: `RES-${booking.website_booking_id || "Unknown"}`,
                user_id: booking.user_id,
                category_id: categoryMap.get(booking.category_id).rawName,
                license: booking.car_license,
                drivers: Array.isArray(booking.driversNames)
                    ? booking.driversNames.map((phone) => ({
                        phone: phone.toString() // ✅ Convert to string just in case
                    }))
                    : [],
                external_car: booking.externalCar,
                startLocation: booking.startLocation,
                endLocation: booking.endLocation,
                status: booking.status,
                eventColor:
                    booking.car_license === ""
                        ? "rgb(255,193,7)"
                        : booking.status === "VERIFIED" && dayjs(booking.start).isAfter(now)
                            ? "rgba(45,183,91,0.8)"
                            : booking.status === "STARTED"
                                ? "rgb(7,94,255)"
                                : booking.status === "FINISHED"
                                    ? "rgb(176,178,183)"
                                    : booking.status === "ACCEPTED"
                                        ? "rgb(255,193,7)"
                                        : "rgb(255,100,100)",
            }

            eventList.push(event);
        });


        setCategories(categoryOptions);  // Store category options for dropdown
        setResources(resourceList);
        setEvents(eventList);
    };

    const fetchBookings = useCallback(
        (query?: any) => {

            /* Calling api but to test it I have utilized fake data from data.json in the form that the api returns its data


            // Determine API endpoint based on query presence
            const isFiltering =
                query && Object.values(query).some((val) => val !== "" && val !== undefined && val !== null);
            const apiEndpoint = isFiltering ? "booking/getByFilters" : "booking/getAll";
            const params = isFiltering
                ? {
                    name: query.category_name,
                    type: query.type,
                    fuel: query.fuel,
                    ...(query.numOfSeats !== undefined && { numOfSeats: query.numOfSeats }),
                    ...(query.automatic !== undefined && { automatic: query.automatic }),
                    email: query.email,
                    telephone: query.telephone,
                    AFM: query.AFM,
                    filterNameByCars: query.filterNameByCars || false,
                }
                : {};

            myApi
                .get(apiEndpoint, { params })
                .then((response) => {
                    processBookings(response.data);
                })
                .catch((error) => {
                    message.error("Failed to fetch bookings");
                    console.error("Error fetching booking data:", error);
                    processBookings({ categories: [], bookings: [] });
                });

             */

            processBookings(fakeData);

        },
        []
    );


    useEffect(() => {
        // On searchParams change, determine whether to fetch with or without filters
        const isSearchParamsEmpty = Object.values(searchParams).every(
            (value) => value === "" || value === undefined || value === null
        );
        fetchBookings(isSearchParamsEmpty ? undefined : searchParams);
    }, [fetchBookings, searchParams]);

    return { events, resources, categories, fetchBookings };
};
