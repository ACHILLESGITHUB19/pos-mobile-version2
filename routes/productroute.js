import express from "express";

const router = express.Router();

router.post("/Create", (req, res) => {
    const { productname, price, category } = req.body;

    if (!productname || !price) {
        return res.status(400).json({ message: "Name and price are required" });
    }

    res.status(201).json({
        id: Date.now(),
        productname,
        price,
        category
    });
});
router.get("/getAll", (req, res) => {
    res.json({ message: "Product route working" });
});

export default router;  
