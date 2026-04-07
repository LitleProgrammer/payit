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
    paid: boolean;
    remaining: number;
}

export interface CreateDebtResponse {
    debtId: string;
    updatedDebts: Debt[];
}

export interface BalanceResponse {
    amountOwed: number;
}

export interface Payment {
    _id?: string;
    amount: number;
    createdAt: Date;
    currency: string;
    from: string;
    to: string;
}

export interface Allocation {
    debtId: string;
    amount: number;
}

export interface ShadowUser {
    _id?: string;
    username: string;
    createdAt: Date;
    owner: string; //The userId of the user that created the shadow user
    status: "active" | "connected";
    connectedToUserId?: string | null;
}

const API_URL = "http://localhost:3000"; // your express server

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
    return res.json() as Promise<ApiResponse<Contact[]>>;
}

export async function getShadowUser(shadowUserId: string) {
    const res = await apiFetch(`/shadows/${shadowUserId}`);
    return res.json() as Promise<ApiResponse<Contact>>;
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

export async function getUserDebts(userID: string) {
    const res = await apiFetch(`/debts/user/${userID}`);
    return res.json() as Promise<ApiResponse<Debt[]>>;
}

export async function editDebt(data: Debt) {
    const res = await apiFetch(`/debts/edit/${data._id}`, {
        method: "POST",
        body: JSON.stringify(data)
    });

    return res.json() as Promise<ApiResponse<Debt[]>>;
}

export async function deleteDebt(debtID: string) {
    const res = await apiFetch(`/debts/delete/${debtID}`, {
        method: "DELETE"
    });

    return res.json() as Promise<ApiResponse<Debt[]>>;
}

export async function payAny(data: {
    to: string;
    amount: number;
    currency: string;
}) {
    const res = await apiFetch("/payments/pay", {
        method: "POST",
        body: JSON.stringify(data)
    });

    return res.json() as Promise<ApiResponse<{ allocations: Allocation[], payment: Payment, updatedDebts: Debt[] }>>;
}

export async function paySpecific(data: {
    amount: number;
    currency: string;
}, debtID: string) {
    const res = await apiFetch("/payments/pay/debt/" + debtID, {
        method: "POST",
        body: JSON.stringify(data)
    });

    return res.json() as Promise<ApiResponse<{ payment: Payment, updatedDebts: Debt[] }>>;
}

export async function getAmountOwed(userID: string) {
    const res = await apiFetch(`/debts/owedby/${userID}`);

    return res.json() as Promise<ApiResponse<BalanceResponse>>;
}

export async function getUserConnections() {
    const res = await apiFetch("/connections");
    return res.json() as Promise<ApiResponse<Contact[]>>;
}

export async function generateConnectionCode() {
    const res = await apiFetch("/connections/code", {
        method: "POST"
    });

    return res.json() as Promise<ApiResponse<{ code: string, expiresAt: Date }>>;
}

export async function redeemConnectionCode(code: string) {
    const res = await apiFetch("/connections/code/redeem", {
        method: "POST",
        body: JSON.stringify({ code })
    });

    return res.json() as Promise<ApiResponse<{}>>;
}

export async function linkShadowUser(shadowUserId: string, realUserId: string) {
    const res = await apiFetch("/shadows/" + shadowUserId + "/link", {
        method: "POST",
        body: JSON.stringify({ realUserId })
    });

    return res.json() as Promise<ApiResponse<{ shadowUserId: string, realUserId: string, updatedShadowUsers: ShadowUser[] }>>;
}

export async function getAnyoneById(id: string) {
    const res = await apiFetch("/users/anyone/" + id);
    return res.json() as Promise<ApiResponse<Contact>>;
}