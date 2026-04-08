import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { login as loginRequest } from "../lib/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { GlassPanel } from "../components/ui/GlassPanel";
import { useAuth } from "~/context/AuthContext";
import { useRedirectIfAuthenticated } from "~/hooks/useRedirectIfAuthenticated";

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");

        const res = await loginRequest(username, password);

        if (res.error) {
            setError(res.error);
            return;
        }

        if (res.token && res.userId) {
            login(res.token, res.userId);
            navigate("/dashboard");
            return;
        }

        navigate("/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center">

            <GlassPanel>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">

                    <h1 className="text-3xl font-semibold text-center">
                        Login
                    </h1>

                    <Input
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <Button type="submit">
                        Login
                    </Button>

                </form>
                <div className="w-full flex items-center justify-center mt-3">
                    <a href="/impressum" className="text-xs hover:underline text-center text-blue-500">Impressum</a>
                </div>
                <p className="text-sm mt-4">Noch keinen Account? <a href="/signup" className="text-blue-500 hover:underline">Registrieren</a></p>
            </GlassPanel>

        </div>
    );
}