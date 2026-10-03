const express = require("express");
const pool = require("../db");

const router = express.Router();

/* Get all customers */
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                customer_key,
                customer_id,
                customer_name,
                email,
                gender,
                age,
                region,
                customer_segment,
                customer_status,
                signup_date
            FROM dim_customer
            ORDER BY customer_key
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customers"
        });
    }
});


/* Get customer profile */
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                c.customer_key,
                c.customer_id,
                c.customer_name,
                c.email,
                c.gender,
                c.age,
                c.region,
                c.customer_segment,
                c.customer_status,
                c.signup_date,
                COUNT(f.activity_key) AS total_activities,
                COALESCE(SUM(f.quantity), 0) AS total_quantity,
                COALESCE(SUM(f.sales_amount), 0) AS total_spending,
                MAX(d.full_date) AS last_activity_date
            FROM dim_customer c
            LEFT JOIN fact_customer_activity f
                ON c.customer_key = f.customer_key
            LEFT JOIN dim_date d
                ON f.date_key = d.date_key
            WHERE c.customer_id = $1
            GROUP BY
                c.customer_key,
                c.customer_id,
                c.customer_name,
                c.email,
                c.gender,
                c.age,
                c.region,
                c.customer_segment,
                c.customer_status,
                c.signup_date
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customer profile"
        });
    }
});


/* Add customer */
router.post("/", async (req, res) => {
    try {
        const {
            customer_id,
            customer_name,
            email,
            gender,
            age,
            region,
            customer_segment,
            signup_date
        } = req.body;

        if (!customer_id || !customer_name || !region) {
            return res.status(400).json({
                message: "Customer ID, name and region are required"
            });
        }

        const result = await pool.query(`
            INSERT INTO dim_customer
            (
                customer_id,
                customer_name,
                email,
                gender,
                age,
                region,
                customer_segment,
                customer_status,
                signup_date
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, 'Active', $8)
            RETURNING *
        `, [
            customer_id,
            customer_name,
            email || null,
            gender || null,
            age || null,
            region,
            customer_segment || 'New',
            signup_date || null
        ]);

        res.status(201).json({
            message: "Customer added successfully",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to add customer"
        });
    }
});


/* Edit customer */
router.put("/:id", async (req, res) => {
    try {
        const {
            customer_name,
            email,
            gender,
            age,
            region,
            customer_segment
        } = req.body;

        const result = await pool.query(`
            UPDATE dim_customer
            SET
                customer_name = $1,
                email = $2,
                gender = $3,
                age = $4,
                region = $5,
                customer_segment = $6
            WHERE customer_id = $7
            RETURNING *
        `, [
            customer_name,
            email || null,
            gender || null,
            age || null,
            region,
            customer_segment,
            req.params.id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json({
            message: "Customer updated successfully",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update customer"
        });
    }
});


/* Deactivate customer */
router.patch("/:id/deactivate", async (req, res) => {
    try {
        const result = await pool.query(`
            UPDATE dim_customer
            SET customer_status = 'Inactive'
            WHERE customer_id = $1
            RETURNING customer_id, customer_name, customer_status
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json({
            message: "Customer deactivated successfully",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to deactivate customer"
        });
    }
});


/* Reactivate customer */
router.patch("/:id/reactivate", async (req, res) => {
    try {
        const result = await pool.query(`
            UPDATE dim_customer
            SET customer_status = 'Active'
            WHERE customer_id = $1
            RETURNING customer_id, customer_name, customer_status
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json({
            message: "Customer reactivated successfully",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to reactivate customer"
        });
    }
});


module.exports = router;