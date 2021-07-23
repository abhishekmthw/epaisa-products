const express = require('express')
const router = express.Router()
const Product = require('../models/product')

// Getting all
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting One
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product)
})

// Creating One
router.post('/', async (req, res) => {
    const product = new Product({
        store: req.body.store,
        productHandler: req.body.productHandler,
        productDisplay: req.body.productDisplay,
        productDescription: req.body.productDescription,
        categories: req.body.categories,
        manufacturers: req.body.manufacturers,
        distributors: req.body.distributors,
        taxes: req.body.taxes,
        hsnCode: req.body.hsnCode,
        variantName: req.body.variantName,
        sellingPrice: req.body.sellingPrice,
        buyingPrice: req.body.buyingPrice,
        mrp: req.body.mrp,
        discount: req.body.discount,
        discountType: req.body.discountType,
        sku: req.body.sku,
        upc: req.body.upc,
        currentQuantity: req.body.currentQuantity,
        newQuantity: req.body.newQuantity,
        threshold: req.body.threshold,
        unitType: req.body.unitType,
        unit: req.body.unit,
        product: req.body.product,
        brand: req.body.brand,
        category: req.body.category,
        shade: req.body.shade,
        uom: req.body.uom,
        rackNo: req.body.rackNo,
        group: req.body.group,
    })

    try {
        if (req.body.productId) {
            const updatedProduct = await Product.findByIdAndUpdate(req.body.productId, req.body)
            res.status(201).json(updatedProduct)
        } else {
            const newProduct = await product.save()
            res.status(201).json(newProduct)
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating One
router.patch('/:id', getProduct, async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body)
        res.json({ message: "Updated Successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Deleting One
router.delete('/:id', getProduct, async (req, res) => {
    try {
        await res.product.remove()
        res.json({ message: "Deleted Product" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Deleting many
router.delete('/', async (req, res) => {
    try {
        await Product.deleteMany()
        res.json({ message: "Deleted Products" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getProduct(req, res, next) {
    let product
    try {
        product = await Product.findById(req.params.id)
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find Product' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.product = product
    next()
}

module.exports = router