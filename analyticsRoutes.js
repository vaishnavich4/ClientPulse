const express = require("express");
const pool = require("./db");

const router = express.Router();


/* Dashboard summary */

router.get("/dashboard", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT

                (SELECT COUNT(*)
                 FROM dim_customer)
                AS total_customers,

                (SELECT COUNT(*)
                 FROM dim_customer
                 WHERE customer_segment = 'High Value')
                AS high_value_customers,

                (SELECT COUNT(*)
                 FROM dim_customer
                 WHERE customer_segment = 'At Risk')
                AS at_risk_customers,

                (SELECT COUNT(DISTINCT customer_key)
                 FROM fact_customer_activity)
                AS active_customers,

                (SELECT COALESCE(SUM(sales_amount), 0)
                 FROM fact_customer_activity)
                AS total_revenue,

                (SELECT COALESCE(SUM(quantity), 0)
                 FROM fact_customer_activity)
                AS total_quantity
        `);

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch dashboard data"
        });

    }

});


/* Customer segments */

router.get("/segments", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                customer_segment AS segment,
                COUNT(*) AS customer_count

            FROM dim_customer

            GROUP BY customer_segment

            ORDER BY customer_count DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customer segments"
        });

    }

});


/* Revenue by region */

router.get("/revenue-by-region", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                r.region_name AS region,

                COALESCE(
                    SUM(f.sales_amount),
                    0
                ) AS revenue

            FROM fact_customer_activity f

            JOIN dim_region r
                ON f.region_key = r.region_key

            GROUP BY r.region_name

            ORDER BY revenue DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch regional revenue"
        });

    }

});


/* Revenue by product */

router.get("/revenue-by-product", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                p.product_name AS product,

                COALESCE(
                    SUM(f.sales_amount),
                    0
                ) AS revenue

            FROM fact_customer_activity f

            JOIN dim_product p
                ON f.product_key = p.product_key

            GROUP BY p.product_name

            ORDER BY revenue DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch product revenue"
        });

    }

});


/* At-risk customers */

router.get("/at-risk", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                customer_id,
                customer_name,
                email,
                region,
                customer_segment,
                signup_date

            FROM dim_customer

            WHERE customer_segment = 'At Risk'

            ORDER BY customer_name
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch at-risk customers"
        });

    }

});


/* Customer activity */

router.get("/activity", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                d.full_date,
                c.customer_name,
                p.product_name,
                r.region_name,
                f.quantity,
                f.sales_amount

            FROM fact_customer_activity f

            JOIN dim_date d
                ON f.date_key = d.date_key

            JOIN dim_customer c
                ON f.customer_key = c.customer_key

            JOIN dim_product p
                ON f.product_key = p.product_key

            JOIN dim_region r
                ON f.region_key = r.region_key

            ORDER BY d.full_date DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customer activity"
        });

    }

});


/* Retention analysis */

router.get("/retention", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                c.customer_id,
                c.customer_name,
                c.region,
                c.customer_segment,

                MAX(d.full_date) AS last_activity_date,

                COUNT(DISTINCT f.date_key)
                    AS activity_days,

                CASE

                    WHEN COUNT(f.activity_key) = 0
                        THEN 'Inactive'

                    WHEN COUNT(DISTINCT f.date_key) >= 2
                        THEN 'Retained'

                    ELSE 'Active'

                END AS retention_status

            FROM dim_customer c

            LEFT JOIN fact_customer_activity f
                ON c.customer_key = f.customer_key

            LEFT JOIN dim_date d
                ON f.date_key = d.date_key

            GROUP BY
                c.customer_id,
                c.customer_name,
                c.region,
                c.customer_segment

            ORDER BY c.customer_name
        `);


        const totalCustomers =
            result.rows.length;


        const activeCustomers =
            result.rows.filter(
                customer =>
                    customer.retention_status === "Active" ||
                    customer.retention_status === "Retained"
            ).length;


        const retainedCustomers =
            result.rows.filter(
                customer =>
                    customer.retention_status === "Retained"
            ).length;


        const inactiveCustomers =
            result.rows.filter(
                customer =>
                    customer.retention_status === "Inactive"
            ).length;


        res.json({

            summary: {

                total_customers: totalCustomers,

                active_customers: activeCustomers,

                retained_customers: retainedCustomers,

                inactive_customers: inactiveCustomers

            },

            customers: result.rows

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Failed to fetch retention data"

        });

    }

});


module.exports = router;
