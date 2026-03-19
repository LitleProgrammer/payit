export interface AuthResponse {
    token?: string
    userId?: string
    message?: string
    error?: string
}

export interface ApiResponse<T> {
    message: string
    error?: string
    data?: T
}

export interface Contact {
    _id: string
    username: string
}

export interface CreateShadowUserResponse {
    shadowUserId: string;
    updatedShadowUsers: Contact[];
}

export interface Debt {
    _id?: string;
    amount: number;
    description: string;
    createdAt: Date;
    debtor: string;
    owner: string;
    currency: string;
    settled: boolean;
    settledAt?: Date;
}

export interface CreateDebtResponse {
    debtId: string;
    updatedDebts: Debt[];
}

const API_URL = "http://192.168.2.194:3000"; // your express server

async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {})
        }
    });

    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return res;
}

export async function signup(username: string, password: string) {
    const res = await fetch(`${API_URL}/users/signup`, {
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
    const res = await fetch(`${API_URL}/users/login`, {
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

export async function createShadowUser(username: string) {
    const res = await apiFetch("/shadows/create", {
        method: "POST",
        body: JSON.stringify({
            username
        })
    });

    return res.json() as Promise<ApiResponse<CreateShadowUserResponse>>;
}

export async function getShadowUsers() {
    const res = await apiFetch("/shadows");
    console.log(res);

    return res.json() as Promise<ApiResponse<Contact[]>>;
}


export async function createDebt(data: {
    debtor: string;
    amount: number;
    currency: string;
    description?: string;
}) {
    const res = await apiFetch("/debts/create", {
        method: "POST",
        body: JSON.stringify(data)
    });

    return res.json() as Promise<ApiResponse<CreateDebtResponse>>;
}