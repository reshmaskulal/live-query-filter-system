const searchInput = document.getElementById("searchInput");
const categoryFilters = document.querySelectorAll(".category-filter");

const resultsContainer = document.getElementById("results");
const loading = document.getElementById("loading");
const noResults = document.getElementById("noResults");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const limit = 6;
let debounceTimer;

function getSelectedCategories() {
    return Array.from(categoryFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
}

async function fetchResults() {
    loading.style.display = "block";
    noResults.style.display = "none";
    resultsContainer.innerHTML = "";

    const search = searchInput.value.trim();
    const categories = getSelectedCategories();

    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (categories.length > 0) {
        params.append("category", categories.join(","));
    }

    params.append("page", currentPage);
    params.append("limit", limit);

    try {
        const response = await fetch(`/api/items?${params.toString()}`);

        if (!response.ok) {
            throw new Error("Failed to fetch results");
        }

        const result = await response.json();

        displayResults(result.data);
        updatePagination(result.pagination);

    } catch (error) {
        console.error(error);

        resultsContainer.innerHTML =
            "<p>Unable to load results. Please try again.</p>";

    } finally {
        loading.style.display = "none";
    }
}

function displayResults(items) {

    if (items.length === 0) {
        noResults.style.display = "block";
        return;
    }

    items.forEach(item => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h2>${item.name}</h2>
            <span class="category">${item.category}</span>
            <p>${item.description}</p>
        `;

        resultsContainer.appendChild(card);
    });
}

function updatePagination(pagination) {

    pageInfo.textContent =
        `Page ${pagination.page} of ${Math.max(pagination.totalPages, 1)}`;

    previousBtn.disabled = pagination.page <= 1;

    nextBtn.disabled =
        pagination.page >= pagination.totalPages ||
        pagination.totalPages === 0;
}

searchInput.addEventListener("input", () => {

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        currentPage = 1;
        fetchResults();
    }, 400);
});

categoryFilters.forEach(checkbox => {

    checkbox.addEventListener("change", () => {
        currentPage = 1;
        fetchResults();
    });

});

previousBtn.addEventListener("click", () => {

    if (currentPage > 1) {
        currentPage--;
        fetchResults();
    }

});

nextBtn.addEventListener("click", () => {

    currentPage++;
    fetchResults();

});

fetchResults();
