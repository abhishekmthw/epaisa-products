const express = require('express')
const router = express.Router()
const Merchant = require('../models/merchant')

// Getting all merchants
router.get('/', async (req, res) => {
    try {
        const merchants = await Merchant.find();
        res.json(merchants)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting One Merchant
router.get('/:id', getMerchant, (req, res) => {
    res.json(res.merchant)
})

// Creating Merchant
router.post('/', async (req, res) => {
    const newMerchant = new Merchant({
        spreadsheetId: req.body.spreadsheetId
    })
    try {
        const merchant = await newMerchant.save();
        res.status(201).json(merchant)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Updating Merchant
router.patch('/:id', async (req, res) => {
    try {
        await Merchant.findByIdAndUpdate(req.params.id, req.body)
        res.json({ message: "Updated Successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Deleting merchants
router.delete('/', async (req, res) => {
    try {
        await Merchant.deleteMany()
        res.json({ message: "Deleted Merchants" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Deleting One Merchant
router.delete('/:id', getMerchant, async (req, res) => {
    try {
        await res.merchant.remove()
        res.json({ message: "Deleted Merchant" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getMerchant(req, res, next) {
    let merchant
    try {
        merchant = await Merchant.findById(req.params.id)
        if (merchant == null) {
            return res.status(404).json({ message: 'Cannot find Merchant' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.merchant = merchant
    next()
}

module.exports = router