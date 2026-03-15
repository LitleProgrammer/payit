import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    token: string | null;
    userId: string | null;
    isAuthenticated: boolean;
    login: (token: string, userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("userId");

        if (storedToken) setToken(storedToken);
        if (storedUser) setUserId(storedUser);
    }, []);

    function login(token: string, userId: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        setToken(token);
        setUserId(userId);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        setToken(null);
        setUserId(null);
    }

    return (
        <AuthContext.Provider value={{ token, userId, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}