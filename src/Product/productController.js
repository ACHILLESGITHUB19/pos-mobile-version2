const express = require('express');

const Product = require('../../models/productModel');

const getDataControllerFn = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('category')
            .populate('brand');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProductControllerFn = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDataControllerFn, createProductControllerFn };
