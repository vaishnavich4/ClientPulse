const API_BASE_URL = "http://127.0.0.1:5000/api";


async function loadSegments() {

    const cardsContainer =
        document.getElementById("segmentCards");

    const tableBody =
        document.getElementById("segmentTableBody");


    try {

        const response = await fetch(
            `${API_BASE_URL}/analytics/segments`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load segment data"
            );

        }


        const segments = await response.json();


        if (segments.length === 0) {

            cardsContainer.innerHTML = `
                <div class="kpi-card">
                    <span class="kpi-label">
                        Customer Segments
                    </span>

                    <strong>0</strong>
                </div>
            `;

            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="table-message">
                        No segment data available.
                    </td>
                </tr>
            `;

            return;
        }


        /*
         * Segment Cards
         */

        cardsContainer.innerHTML = "";


        segments.forEach(segment => {

            const card =
                document.createElement("div");

            card.className = "kpi-card";


            card.innerHTML = `
                <span class="kpi-label">
                    ${segment.segment}
                </span>

                <strong>
                    ${segment.customer_count}
                </strong>
            `;


            cardsContainer.appendChild(card);

        });


        /*
         * Calculate total customers
         */

        const totalCustomers =
            segments.reduce(
                (total, segment) =>
                    total + Number(segment.customer_count),
                0
            );


        /*
         * Segment Table
         */

        tableBody.innerHTML = "";


        segments.forEach(segment => {

            const customerCount =
                Number(segment.customer_count);


            const percentage =
                totalCustomers === 0
                    ? 0
                    : (
                        customerCount /
                        totalCustomers *
                        100
                    );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${segment.segment}
                </td>

                <td>
                    ${customerCount}
                </td>

                <td>
                    ${percentage.toFixed(1)}%
                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(error);


        cardsContainer.innerHTML = `
            <div class="kpi-card">
                <span class="kpi-label">
                    Status
                </span>

                <strong>
                    Error
                </strong>
            </div>
        `;


        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="table-message">
                    Unable to load segment data.
                </td>
            </tr>
        `;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadSegments();
    }
);