import axios from "axios";

export const myApi = axios.create({
    baseURL: `http://localhost:8080/api/v1/`, // Adjust this to your backend's base URL
});