
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Load data
const dataPath = path.join(__dirname, "data.json");
const items = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Search and filter API
app.get("/api/items", (req, res) => {
    const search = (req.query.search || "").toLowerCase().trim();
    const category = (req.query.category || "").trim();
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 6, 1);

    let filteredItems = items;

    // Search filter
    if (search) {
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search)
        );
    }

    // Category filter
    if (category) {
        const categories = category
            .split(",")
            .map(c => c.trim().toLowerCase())
            .filter(Boolean);

        filteredItems = filteredItems.filter(item =>
            categories.includes(item.category.toLowerCase())
        );
    }

    // Pagination
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / limit);

    const startIndex = (page - 1) * limit;
    const paginatedItems = filteredItems.slice(
        startIndex,
        startIndex + limit
    );

    res.json({
        success: true,
        data: paginatedItems,
        pagination: {
            page: page,
            limit: limit,
            totalItems: totalItems,
            totalPages: totalPages
        }
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
