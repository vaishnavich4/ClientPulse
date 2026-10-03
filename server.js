const express = require("express");
const cors = require("cors");
const pool = require("./db");

const customerRoutes = require("./routes/customerRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("ClientPulse Backend is running!");
});


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


app.use("/api/customers", customerRoutes);

app.use("/api/analytics", analyticsRoutes);


app.listen(PORT, () => {
    console.log(
        `ClientPulse server running on http://localhost:${PORT}`
    );
});