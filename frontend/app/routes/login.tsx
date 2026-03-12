import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../lib/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { GlassPanel } from "../components/ui/GlassPanel";

export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");

        const res = await login(username, password);

        if (res.error) {
            setError(res.error);
            return;
        }

        if (res.token) {
            localStorage.setItem("token", res.token);
        }

        navigate("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center">

            <GlassPanel>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">

                    <h1 className="text-2xl font-semibold">
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

            </GlassPanel>

        </div>
    );
}