import express from "express";

const router = express.Router();


let categories = [];

router.post("/Create", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    const newCategory = {
        id: categories.length + 1,
        name,
    };

    categories.push(newCategory);

    res.status(201).json(newCategory);
});


router.get("/getAll", (req, res) => {
    res.json(categories);
});

export default router;
