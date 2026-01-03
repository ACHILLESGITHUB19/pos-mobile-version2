const Brand = require('../../models/brandModel');

const getDataControllerFn = async (req, res) => {
    try {
        const brands = await Brand.find({});
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createbrandControllerFn = async (req, res) => {
    try {
        const newBrand = new Brand(req.body);
        const savedBrand = await newBrand.save();
        res.status(201).json(savedBrand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDataControllerFn, createbrandControllerFn };
