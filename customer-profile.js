const API_BASE_URL = "http://127.0.0.1:5000/api";


async function loadCustomerProfile() {

    const params = new URLSearchParams(window.location.search);

    const customerId = params.get("id");


    if (!customerId) {

        document.getElementById("profileMessage").textContent =
            "Customer ID was not provided.";

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/customers/${customerId}`
        );


        if (!response.ok) {

            throw new Error("Failed to load customer profile");

        }


        const customer = await response.json();


        document.getElementById("customerId").textContent =
            customer.customer_id;

        document.getElementById("customerName").textContent =
            customer.customer_name;

        document.getElementById("customerEmail").textContent =
            customer.email || "-";

        document.getElementById("customerRegion").textContent =
            customer.region || "-";

        document.getElementById("customerSegment").textContent =
            customer.customer_segment || "-";

        document.getElementById("signupDate").textContent =
            customer.signup_date || "-";


        document.getElementById("totalActivities").textContent =
            customer.total_activities;

        document.getElementById("totalQuantity").textContent =
            customer.total_quantity;

        document.getElementById("totalSpending").textContent =
            `₹${Number(customer.total_spending).toLocaleString("en-IN")}`;

        document.getElementById("lastActivity").textContent =
            customer.last_activity_date || "-";


        document.getElementById("profileMessage").textContent =
            `${customer.customer_name} is a ${customer.customer_segment} customer from ${customer.region}.`;

    }


    catch (error) {

        console.error(error);


        document.getElementById("profileMessage").textContent =
            "Unable to load customer profile.";

    }

}


document.addEventListener("DOMContentLoaded", () => {

    loadCustomerProfile();

});