import { useState } from "react";
import { useNavigate } from "react-router";
import { signup } from "../lib/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { GlassPanel } from "../components/ui/GlassPanel";

export default function Signup() {

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

                    <h1 className="text-2xl font-semibold">
                        Create Account
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

            </GlassPanel>

        </div>
    );
}