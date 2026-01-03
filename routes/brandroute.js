import express from "express";

const router = express.Router();

router.post("/Create", (req, res) => {
    const { brandname } = req.body;

    if (!brandname) {
        return res.status(400).json({ message: "Brand name is required" });
    }

    res.status(201).json({
        id: Date.now(),
        brandname
    });
});

router.get("/GetAll", (req, res) => {
    res.json({ message: "Brand route working" });
});

export default router;   
