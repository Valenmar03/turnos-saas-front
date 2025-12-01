import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// src/config/currentBusiness.ts
export const CURRENT_BUSINESS_ID = "6929ddea644b438db538365c";

