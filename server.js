const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");

const customerRoutes = require("./customerRoutes");
const analyticsRoutes = require("./analyticsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* Serve frontend files from the repository root */
app.use(express.static(__dirname));

/* Keep the existing /css/... and /js/... paths working */
app.get("/css/:file", (req, res) => {
    res.sendFile(path.join(__dirname, req.params.file));
});

app.get("/js/:file", (req, res) => {
    res.sendFile(path.join(__dirname, req.params.file));
});

/* Home page */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

/* Database test */
app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT COUNT(*) FROM dim_customer"
        );

        res.json({
            message: "Database connection successful",
            customer_count: result.rows[0].count
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

/* API routes */
app.use("/api/customers", customerRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
    console.log(`ClientPulse running on port ${PORT}`);
});
