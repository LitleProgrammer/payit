import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("signup", "routes/signup.tsx"),
    route("login", "routes/login.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("debts/:userID", "routes/debts.tsx"),
    route("contacts", "routes/contacts.tsx"),
] satisfies RouteConfig;
