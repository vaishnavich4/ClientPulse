const API_BASE_URL = "http://127.0.0.1:5000/api";

let allCustomers = [];
let editingCustomer = false;


/* =========================
   LOAD CUSTOMERS
========================= */

async function loadCustomers() {

    const tableBody = document.getElementById("customerTableBody");

    try {

        const response = await fetch(`${API_BASE_URL}/customers`);

        if (!response.ok) {
            throw new Error("Failed to load customers");
        }

        allCustomers = await response.json();

        applyFilters();

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="table-message">
                    Unable to load customers.
                </td>
            </tr>
        `;
    }
}


/* =========================
   DISPLAY CUSTOMERS
========================= */

function displayCustomers(customers) {

    const tableBody = document.getElementById("customerTableBody");

    tableBody.innerHTML = "";

    if (customers.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="table-message">
                    No customers found.
                </td>
            </tr>
        `;

        return;
    }


    customers.forEach(customer => {

        const row = document.createElement("tr");

        const status =
            String(customer.customer_status || "Active").trim();

        const statusClass =
            status.toLowerCase() === "active"
                ? "status-active"
                : "status-inactive";


        let actionHTML = `
            <a href="customer-profile.html?id=${encodeURIComponent(customer.customer_id)}">
                View
            </a>

            &nbsp;|&nbsp;

            <a href="#" class="edit-link" data-id="${customer.customer_id}">
                Edit
            </a>

            &nbsp;|&nbsp;
        `;


        if (status.toLowerCase() === "active") {

            actionHTML += `
                <a href="#" class="deactivate-link" data-id="${customer.customer_id}">
                    Deactivate
                </a>
            `;

        } else {

            actionHTML += `
                <a href="#" class="reactivate-link" data-id="${customer.customer_id}">
                    Reactivate
                </a>
            `;
        }


        row.innerHTML = `
            <td>${customer.customer_id || "-"}</td>

            <td>${customer.customer_name || "-"}</td>

            <td>${customer.email || "-"}</td>

            <td>${customer.region || "-"}</td>

            <td>${customer.customer_segment || "-"}</td>

            <td>
                <span class="status-badge ${statusClass}">
                    ${status}
                </span>
            </td>

            <td>
                ${actionHTML}
            </td>
        `;


        tableBody.appendChild(row);

    });
}


/* =========================
   FILTER CUSTOMERS
========================= */

function applyFilters() {

    const searchInput =
        document.getElementById("customerSearch");

    const regionFilter =
        document.getElementById("regionFilter");

    const segmentFilter =
        document.getElementById("segmentFilter");

    const statusFilter =
        document.getElementById("statusFilter");


    if (!searchInput ||
        !regionFilter ||
        !segmentFilter ||
        !statusFilter) {

        return;
    }


    const searchValue =
        searchInput.value.trim().toLowerCase();

    const selectedRegion =
        regionFilter.value.trim().toLowerCase();

    const selectedSegment =
        segmentFilter.value.trim().toLowerCase();

    const selectedStatus =
        statusFilter.value.trim().toLowerCase();


    const filteredCustomers = allCustomers.filter(customer => {

        const name =
            String(customer.customer_name || "")
                .trim()
                .toLowerCase();

        const customerId =
            String(customer.customer_id || "")
                .trim()
                .toLowerCase();

        const region =
            String(customer.region || "")
                .trim()
                .toLowerCase();

        const segment =
            String(customer.customer_segment || "")
                .trim()
                .toLowerCase();

        const status =
            String(customer.customer_status || "Active")
                .trim()
                .toLowerCase();


        const matchesSearch =
            searchValue === "" ||
            name.includes(searchValue) ||
            customerId.includes(searchValue);


        const matchesRegion =
            selectedRegion === "" ||
            region === selectedRegion;


        const matchesSegment =
            selectedSegment === "" ||
            segment === selectedSegment;


        const matchesStatus =
            selectedStatus === "" ||
            status === selectedStatus;


        return (
            matchesSearch &&
            matchesRegion &&
            matchesSegment &&
            matchesStatus
        );

    });


    displayCustomers(filteredCustomers);
}


/* =========================
   OPEN ADD CUSTOMER MODAL
========================= */

function openAddCustomerModal() {

    editingCustomer = false;

    const modal =
        document.getElementById("customerModal");

    const form =
        document.getElementById("customerForm");


    document.getElementById("modalTitle").textContent =
        "Add Customer";


    form.reset();


    document.getElementById("editCustomerId").value =
        "";


    document.getElementById("formCustomerId").disabled =
        false;


    modal.style.display = "flex";
}


/* =========================
   CLOSE CUSTOMER MODAL
========================= */

function closeCustomerModal() {

    const modal =
        document.getElementById("customerModal");

    modal.style.display = "none";
}


/* =========================
   EDIT CUSTOMER
========================= */

function editCustomer(customerId) {

    const customer =
        allCustomers.find(
            item =>
                String(item.customer_id) ===
                String(customerId)
        );


    if (!customer) {

        alert("Customer not found.");

        return;
    }


    editingCustomer = true;


    document.getElementById("modalTitle").textContent =
        "Edit Customer";


    document.getElementById("editCustomerId").value =
        customer.customer_id;


    document.getElementById("formCustomerId").value =
        customer.customer_id;


    document.getElementById("formCustomerId").disabled =
        true;


    document.getElementById("formCustomerName").value =
        customer.customer_name || "";


    document.getElementById("formEmail").value =
        customer.email || "";


    document.getElementById("formGender").value =
        customer.gender || "";


    document.getElementById("formAge").value =
        customer.age || "";


    document.getElementById("formRegion").value =
        customer.region || "";


    document.getElementById("formSegment").value =
        customer.customer_segment || "New";


    document.getElementById("formSignupDate").value =
        customer.signup_date
            ? String(customer.signup_date).substring(0, 10)
            : "";


    document.getElementById("customerModal").style.display =
        "flex";
}


/* =========================
   SAVE CUSTOMER
========================= */

async function saveCustomer(event) {

    event.preventDefault();


    const customerId =
        document.getElementById("formCustomerId")
            .value
            .trim();


    const customerData = {

        customer_id: customerId,

        customer_name:
            document.getElementById("formCustomerName")
                .value
                .trim(),

        email:
            document.getElementById("formEmail")
                .value
                .trim(),

        gender:
            document.getElementById("formGender")
                .value,

        age:
            document.getElementById("formAge")
                .value
                ? Number(
                    document.getElementById("formAge")
                        .value
                )
                : null,

        region:
            document.getElementById("formRegion")
                .value,

        customer_segment:
            document.getElementById("formSegment")
                .value,

        signup_date:
            document.getElementById("formSignupDate")
                .value || null
    };


    try {

        let response;


        if (editingCustomer) {

            response = await fetch(
                `${API_BASE_URL}/customers/${customerId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(customerData)
                }
            );

        } else {

            response = await fetch(
                `${API_BASE_URL}/customers`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(customerData)
                }
            );
        }


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to save customer"
            );
        }


        alert(
            editingCustomer
                ? "Customer updated successfully."
                : "Customer added successfully."
        );


        closeCustomerModal();


        await loadCustomers();


    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


/* =========================
   DEACTIVATE CUSTOMER
========================= */

async function deactivateCustomer(customerId) {

    const confirmed =
        confirm(
            "Are you sure you want to deactivate this customer?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/customers/${customerId}/deactivate`,
            {
                method: "PATCH"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to deactivate customer"
            );
        }


        alert("Customer deactivated successfully.");


        await loadCustomers();


    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


/* =========================
   REACTIVATE CUSTOMER
========================= */

async function reactivateCustomer(customerId) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/customers/${customerId}/reactivate`,
            {
                method: "PATCH"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to reactivate customer"
            );
        }


        alert("Customer reactivated successfully.");


        await loadCustomers();


    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


/* =========================
   PAGE EVENTS
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("customerSearch");

    const regionFilter =
        document.getElementById("regionFilter");

    const segmentFilter =
        document.getElementById("segmentFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const customerForm =
        document.getElementById("customerForm");

    const customerTableBody =
        document.getElementById("customerTableBody");


    /* Filters */

    searchInput.addEventListener(
        "input",
        applyFilters
    );


    regionFilter.addEventListener(
        "change",
        applyFilters
    );


    segmentFilter.addEventListener(
        "change",
        applyFilters
    );


    statusFilter.addEventListener(
        "change",
        applyFilters
    );


    /* Customer form */

    customerForm.addEventListener(
        "submit",
        saveCustomer
    );


    /* Table actions */

    customerTableBody.addEventListener(
        "click",
        event => {

            const editLink =
                event.target.closest(".edit-link");

            const deactivateLink =
                event.target.closest(".deactivate-link");

            const reactivateLink =
                event.target.closest(".reactivate-link");


            if (editLink) {

                event.preventDefault();

                editCustomer(
                    editLink.dataset.id
                );

                return;
            }


            if (deactivateLink) {

                event.preventDefault();

                deactivateCustomer(
                    deactivateLink.dataset.id
                );

                return;
            }


            if (reactivateLink) {

                event.preventDefault();

                reactivateCustomer(
                    reactivateLink.dataset.id
                );

                return;
            }

        }
    );


    /* Load data */

    loadCustomers();

});s