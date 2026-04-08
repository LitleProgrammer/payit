import { use, useState } from "react";
import { useNavigate } from "react-router";
import { signup } from "../lib/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { GlassPanel } from "../components/ui/GlassPanel";
import { useRedirectIfAuthenticated } from "~/hooks/useRedirectIfAuthenticated";

export default function Signup() {
    useRedirectIfAuthenticated();

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");

        const res = await signup(username, password);

        if (res.error) {
            setError(res.error);
            return;
        }

        navigate("/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center">

            <GlassPanel>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">

                    <h1 className="text-3xl font-semibold text-center">
                        Signup
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
                        Signup
                    </Button>

                </form>
                <div className="w-full flex items-center justify-center mt-3">
                    <a href="/impressum" className="text-xs hover:underline text-center text-blue-500">Impressum</a>
                </div>
                <p className="text-sm mt-4">Hast schon ein Account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
            </GlassPanel>

        </div>
    );
}