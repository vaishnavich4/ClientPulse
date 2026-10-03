const API_BASE_URL = "http://127.0.0.1:5000/api";


async function loadDashboard() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/analytics/dashboard`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load dashboard data"
            );

        }


        const data = await response.json();


        /*
         * Total Customers
         */

        const totalCustomers =
            document.getElementById(
                "totalCustomers"
            );

        if (totalCustomers) {

            totalCustomers.textContent =
                data.total_customers;

        }


        /*
         * Active Customers
         */

        const activeCustomers =
            document.getElementById(
                "activeCustomers"
            );

        if (activeCustomers) {

            activeCustomers.textContent =
                data.active_customers;

        }


        /*
         * At-Risk Customers
         */

        const atRiskCustomers =
            document.getElementById(
                "atRiskCustomers"
            );

        if (atRiskCustomers) {

            atRiskCustomers.textContent =
                data.at_risk_customers;

        }


        /*
         * Total Revenue
         */

        const totalRevenue =
            document.getElementById(
                "totalRevenue"
            );

        if (totalRevenue) {

            totalRevenue.textContent =
                `₹${Number(
                    data.total_revenue
                ).toLocaleString("en-IN")}`;

        }


        /*
         * Customer Segments
         */

        const segmentContainer =
            document.getElementById(
                "segmentContainer"
            );


        if (segmentContainer) {

            const response =
                await fetch(
                    `${API_BASE_URL}/analytics/segments`
                );


            const segments =
                await response.json();


            segmentContainer.innerHTML = "";


            segments.forEach(segment => {

                const item =
                    document.createElement("div");


                item.className =
                    "segment-item";


                item.innerHTML = `

                    <span>
                        ${segment.segment}
                    </span>

                    <strong>
                        ${segment.customer_count}
                    </strong>

                `;


                segmentContainer.appendChild(item);

            });

        }


        /*
         * Revenue by Region
         */

        const regionContainer =
            document.getElementById(
                "regionContainer"
            );


        if (regionContainer) {

            const response =
                await fetch(
                    `${API_BASE_URL}/analytics/revenue-by-region`
                );


            const regions =
                await response.json();


            regionContainer.innerHTML = "";


            regions.forEach(region => {

                const item =
                    document.createElement("div");


                item.className =
                    "region-item";


                item.innerHTML = `

                    <span>
                        ${region.region}
                    </span>

                    <strong>
                        ₹${Number(
                            region.revenue
                        ).toLocaleString("en-IN")}
                    </strong>

                `;


                regionContainer.appendChild(item);

            });

        }


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);