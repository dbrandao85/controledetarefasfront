import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7265"
});

export default api;