const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    store: {
        type: String
    },
    productHandler: {
        type: String
    },
    productDisplay: {
        type: String
    },
    productDescription: {
        type: String
    },
    categories: {
        type: String
    },
    manufacturers: {
        type: String
    },
    distributors: {
        type: String
    },
    taxes: {
        type: String
    },
    hsnCode: {
        type: String
    },
    variantName: {
        type: String
    },
    sellingPrice: {
        type: String
    },
    buyingPrice: {
        type: String
    },
    mrp: {
        type: String
    },
    discount: {
        type: String
    },
    discountType: {
        type: String
    },
    sku: {
        type: String
    },
    upc: {
        type: String
    },
    currentQuantity: {
        type: String
    },
    newQuantity: {
        type: String
    },
    threshold: {
        type: String
    },
    unitType: {
        type: String
    },
    unit: {
        type: String
    },
    product: {
        type: String
    },
    brand: {
        type: String
    },
    category: {
        type: String
    },
    shade: {
        type: String
    },
    uom: {
        type: String
    },
    rackNo: {
        type: String
    },
    group: {
        type: String
    },
    merchantId: {
        type: String
    }
})

module.exports = mongoose.model('Product', productSchema)