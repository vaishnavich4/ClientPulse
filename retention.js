const API_BASE_URL = "http://127.0.0.1:5000/api";


async function loadRetention() {

    const tableBody =
        document.getElementById("retentionTableBody");


    try {

        const response = await fetch(
            `${API_BASE_URL}/analytics/retention`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load retention data"
            );

        }


        const data = await response.json();


        /*
         * Update KPI cards
         */

        document.getElementById("totalCustomers").textContent =
            data.summary.total_customers;


        document.getElementById("activeCustomers").textContent =
            data.summary.active_customers;


        document.getElementById("retainedCustomers").textContent =
            data.summary.retained_customers;


        document.getElementById("inactiveCustomers").textContent =
            data.summary.inactive_customers;


        /*
         * Update customer table
         */

        if (data.customers.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="table-message">
                        No retention data available.
                    </td>
                </tr>
            `;

            return;

        }


        tableBody.innerHTML = "";


        data.customers.forEach(customer => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${customer.customer_id}
                </td>

                <td>
                    ${customer.customer_name}
                </td>

                <td>
                    ${customer.region}
                </td>

                <td>
                    ${customer.customer_segment}
                </td>

                <td>
                    ${customer.last_activity_date || "-"}
                </td>

                <td>
                    ${customer.retention_status}
                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(error);


        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="table-message">
                    Unable to load retention data.
                </td>
            </tr>
        `;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadRetention();

    }
);