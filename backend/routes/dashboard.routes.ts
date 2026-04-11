import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { DashboardService } from "../services/dashboard.service";

export function createDashboardRouter(dashboardService: DashboardService) {
    const router = Router();

    router.get("/summary", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const ownerId = req.user!.userId;

            const summary = await dashboardService.getDashboardSummary(ownerId);

            res.status(200).json({
                message: "Dashboard summary fetched",
                data: summary
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message
            });
        }
    });

    router.get("/contact-balances", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const ownerId = req.user!.userId;

            const balances = await dashboardService.getContactBalances(ownerId);

            res.status(200).json({
                message: "Contact balances fetched",
                data: balances
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message
            });
        }
    });

    return router;
}