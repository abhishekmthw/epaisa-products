const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const Merchant = require('../models/merchant')

const { google } = require('googleapis');
const keys = require('../keys.json');

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

async function addSheetData(updatedProduct, merchant) {

    const gsapi = google.sheets({ version: 'v4', auth: client })
    const product = [[
        updatedProduct.store,
        updatedProduct.productHandler,
        updatedProduct.productDisplay,
        updatedProduct.productDescription,
        updatedProduct.categories,
        updatedProduct.manufacturers,
        updatedProduct.distributors,
        updatedProduct.taxes,
        updatedProduct.hsnCode,
        updatedProduct.variantName,
        updatedProduct.sellingPrice,
        updatedProduct.buyingPrice,
        updatedProduct.mrp,
        updatedProduct.discount,
        updatedProduct.discountType,
        updatedProduct.sku,
        updatedProduct.upc,
        updatedProduct.currentQuantity,
        updatedProduct.newQuantity,
        updatedProduct.threshold,
        updatedProduct.unitType,
        updatedProduct.unit,
        updatedProduct.product,
        updatedProduct.brand,
        updatedProduct.category,
        updatedProduct.shade,
        updatedProduct.uom,
        updatedProduct.rackNo,
        updatedProduct.group,
        updatedProduct._id,
    ]];
    const opt = {
        spreadsheetId: merchant.spreadsheetId,
        range: `Products!A${merchant.totalRows + 2}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: product }
    };

    let res = await gsapi.spreadsheets.values.update(opt);
    console.log("Updated Sheets Successfully");
}

async function getSheetData(ssId) {

    const gsapi = google.sheets({ version: 'v4', auth: client })
    const opt = {
        spreadsheetId: ssId,
        range: `Products!A2:AE`
    };

    let res = await gsapi.spreadsheets.values.get(opt);
    let productList = [];
    for (let i = 0; i < res.data.values.length; i++) {
        if (res.data.values[i][0] != "") {
            productList[i] = {
                store: res.data.values[i][0],
                productHandler: res.data.values[i][1],
                productDisplay: res.data.values[i][2],
                productDescription: res.data.values[i][3],
                categories: res.data.values[i][4],
                manufacturers: res.data.values[i][5],
                distributors: res.data.values[i][6],
                taxes: res.data.values[i][7],
                hsnCode: res.data.values[i][8],
                variantName: res.data.values[i][9],
                sellingPrice: res.data.values[i][10],
                buyingPrice: res.data.values[i][11],
                mrp: res.data.values[i][12],
                discount: res.data.values[i][13],
                discountType: res.data.values[i][14],
                sku: res.data.values[i][15],
                upc: res.data.values[i][16],
                currentQuantity: res.data.values[i][17],
                newQuantity: res.data.values[i][18],
                threshold: res.data.values[i][19],
                unitType: res.data.values[i][20],
                unit: res.data.values[i][21],
                product: res.data.values[i][22],
                brand: res.data.values[i][23],
                category: res.data.values[i][24],
                shade: res.data.values[i][25],
                uom: res.data.values[i][26],
                rackNo: res.data.values[i][27],
                group: res.data.values[i][28],
                productId: res.data.values[i][29]
            }
        }
    }
    return productList;
}

// Updating Product ID
async function addProductId(productId, ssId, rowNumber) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const opt = {
        spreadsheetId: ssId,
        range: `Products!AD${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[productId]] }
    };
    await gsapi.spreadsheets.values.clear(opt)
    console.log("Deleted Data Successfully")
}

// Updating Sheets
async function updateSheets(data, ssId, rowNumber) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const opt = {
        spreadsheetId: ssId,
        range: `Products!A${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: data }
    };
    let res = await gsapi.spreadsheets.values.update(opt);
    console.log("Updated Sheets Successfully");
}

// Deleting All Products from sheets
async function deleteSheetData(ssId) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const opt = {
        spreadsheetId: ssId,
        range: `Products!A2`
    };
    await gsapi.spreadsheets.values.clear(opt)
    console.log("Deleted All Data Successfully")
}

// Getting all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting One Product
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product)
})

// Update DataBase from Spreadsheet
router.post('/sheets/', async (req, res) => {
    try {
        const merchant = await Merchant.findOne({ spreadsheetId: req.body.spreadsheetId });
        let sheetData = await getSheetData(merchant.spreadsheetId);
        let products = await Product.find();
        // Deleting data from Database
        for (let i = 0; i < sheetData.length; i++) {
            var check = 0;
            for (let j = 0; j < products.length; j++) {
                if (sheetData[i].productId == products[j]._id || sheetData[i].productId == "") {
                    check = 1;
                    break;
                }
            }
            if (check == 0) {
                const deletedProduct = await Product.findByIdAndDelete(products[i]._id);
                await Merchant.findById(deletedProduct.merchantId, { totalRows: totalRows - 1 })
            }
        }
        // Adding and Updating Database
        for (let i = 0; i < sheetData.length; i++) {
            if (sheetData[i].productId == "") {
                sheetData[i] = { ...sheetData[i], merchantId: merchant._id }
                const newProduct = new Product(sheetData[i]);
                const updatedProduct = await newProduct.save();
                console.log(updatedProduct)
                client.authorize(async (err, tokens) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        await addProductId(updatedProduct._id, merchant.spreadsheetId, i + 2);
                    }
                });
            } else {
                await Product.findByIdAndUpdate(sheetData[i].productId, sheetData[i]);
            }
        }
        products = await Product.find();
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Creating One
router.post('/', async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const updatedProduct = await newProduct.save();
        let merchant = await Merchant.findById(updatedProduct.merchantId);
        merchant = await Merchant.findByIdAndUpdate(updatedProduct.merchantId, { totalRows: merchant.totalRows + 1 });
        client.authorize((err, tokens) => {
            if (err) {
                console.log(err);
                return;
            } else {
                addSheetData(updatedProduct, merchant);
            }
        });
        res.status(201).json(updatedProduct)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating One
router.patch('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body)
        const merchant = await Merchant.findById(updatedProduct.merchantId);
        client.authorize((err, tokens) => {
            if (err) {
                console.log(err);
                return;
            } else {
                let updatedSheetData = [];
                for (let i = 0; i < sheetData.length; i++) {
                    if (sheetData[i].productId == req.params.id) {
                        updatedSheetData[0] = Object.keys(updatedProduct)
                        updateSheets(updatedSheetData, merchant.spreadsheetId, i + 2)
                        break;
                    } else {
                        continue;
                    }
                }
            }
        });
        res.json({ message: "Updated Successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Deleting many
router.delete('/', async (req, res) => {
    try {
        const product = await Product.findOne()
        await Product.deleteMany()
        console.log(product)
        merchant = await Merchant.findById(product.merchantId)
        await Merchant.findByIdAndUpdate(product.merchantId, { totalRows: 0 })
        await deleteSheetData(merchant.spreadsheetId)
        res.json({ message: "Deleted Products" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Deleting One
router.delete('/:id', getProduct, async (req, res) => {
    try {
        await res.product.remove()
        const merchant = await Merchant.findById(res.product.merchantId)
        const sheetData = await getSheetData(merchant.spreadsheetId)
        let count = 0;
        let updatedSheetData = [];
        for (let i = 0; i < sheetData.length; i++) {
            if (sheetData[i].productId == res.product._id) {
                continue;
            } else {
                updatedSheetData[count++] = sheetData[i];
            }
        }
        updateSheets(updatedSheetData, merchant.spreadsheetId, 2)
        res.json({ message: "Deleted Product" })
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