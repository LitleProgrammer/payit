export interface AuthResponse {
    token?: string
    userId?: string
    message?: string
    error?: string
}

const API_URL = "http://localhost:3000"; // your express server

export async function signup(username: string, password: string) {
    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    return res.json() as Promise<AuthResponse>;
}

export async function login(username: string, password: string) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    return res.json() as Promise<AuthResponse>;
}