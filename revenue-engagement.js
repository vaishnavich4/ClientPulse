const API_BASE_URL =
    "http://127.0.0.1:5000/api";


async function loadRevenueEngagement() {

    try {

        const dashboardResponse =
            await fetch(
                `${API_BASE_URL}/analytics/dashboard`
            );


        const regionResponse =
            await fetch(
                `${API_BASE_URL}/analytics/revenue-by-region`
            );


        const productResponse =
            await fetch(
                `${API_BASE_URL}/analytics/revenue-by-product`
            );


        const activityResponse =
            await fetch(
                `${API_BASE_URL}/analytics/activity`
            );


        if (
            !dashboardResponse.ok ||
            !regionResponse.ok ||
            !productResponse.ok ||
            !activityResponse.ok
        ) {

            throw new Error(
                "Failed to load analytics data"
            );

        }


        const dashboard =
            await dashboardResponse.json();


        const regions =
            await regionResponse.json();


        const products =
            await productResponse.json();


        const activities =
            await activityResponse.json();


        /* KPI values */

        document.getElementById(
            "totalRevenue"
        ).textContent =
            `₹${Number(
                dashboard.total_revenue
            ).toLocaleString("en-IN")}`;


        document.getElementById(
            "totalQuantity"
        ).textContent =
            dashboard.total_quantity;


        document.getElementById(
            "totalActivities"
        ).textContent =
            activities.length;


        document.getElementById(
            "activeCustomers"
        ).textContent =
            dashboard.active_customers;


        /* Revenue by Region */

        const regionBody =
            document.getElementById(
                "regionTableBody"
            );


        regionBody.innerHTML = "";


        regions.forEach(region => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${region.region}
                </td>

                <td>
                    ₹${Number(
                        region.revenue
                    ).toLocaleString("en-IN")}
                </td>

            `;


            regionBody.appendChild(row);

        });


        /* Revenue by Product */

        const productBody =
            document.getElementById(
                "productTableBody"
            );


        productBody.innerHTML = "";


        products.forEach(product => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${product.product}
                </td>

                <td>
                    ₹${Number(
                        product.revenue
                    ).toLocaleString("en-IN")}
                </td>

            `;


            productBody.appendChild(row);

        });


        /* Customer Activity */

        const activityBody =
            document.getElementById(
                "activityTableBody"
            );


        activityBody.innerHTML = "";


        activities.forEach(activity => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${activity.full_date}
                </td>

                <td>
                    ${activity.customer_name}
                </td>

                <td>
                    ${activity.product_name}
                </td>

                <td>
                    ${activity.region_name}
                </td>

                <td>
                    ${activity.quantity}
                </td>

                <td>
                    ₹${Number(
                        activity.sales_amount
                    ).toLocaleString("en-IN")}
                </td>

            `;


            activityBody.appendChild(row);

        });


    } catch (error) {

        console.error(error);

        document.getElementById(
            "regionTableBody"
        ).innerHTML = `
            <tr>
                <td colspan="2">
                    Unable to load regional revenue.
                </td>
            </tr>
        `;

        document.getElementById(
            "productTableBody"
        ).innerHTML = `
            <tr>
                <td colspan="2">
                    Unable to load product revenue.
                </td>
            </tr>
        `;

        document.getElementById(
            "activityTableBody"
        ).innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load customer activity.
                </td>
            </tr>
        `;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadRevenueEngagement
);