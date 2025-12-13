// src/api/utils.js

export const BASE_URL = "https://regis-production-ca14.up.railway.app";

export function getAuthHeader() {
    const token = localStorage.getItem("token"); 
    if (!token) {
        throw new Error("Authentication Failed: No token found. Please log in.");
    }
    return {
        'Authorization': `Bearer ${token}`,
    };
}
