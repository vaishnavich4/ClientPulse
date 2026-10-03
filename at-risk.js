const API_BASE_URL = "http://127.0.0.1:5000/api";


async function loadAtRiskCustomers() {

    const tableBody =
        document.getElementById("riskTableBody");


    try {

        const response = await fetch(
            `${API_BASE_URL}/analytics/at-risk`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load at-risk customers"
            );

        }


        const customers =
            await response.json();


        document.getElementById(
            "riskCount"
        ).textContent = customers.length;


        if (customers.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No at-risk customers found.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = "";


        customers.forEach(customer => {

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
                    ${customer.email || "-"}
                </td>

                <td>
                    ${customer.region || "-"}
                </td>

                <td>
                    ${customer.customer_segment}
                </td>

                <td>

                    <a
                        href="customer-profile.html?id=${customer.customer_id}"
                        style="color:#2563eb;"
                    >
                        View
                    </a>

                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(error);


        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load at-risk customers.
                </td>
            </tr>
        `;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadAtRiskCustomers
);