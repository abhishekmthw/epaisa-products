const mongoose = require('mongoose')

const merchantSchema = new mongoose.Schema({
    spreadsheetId: {
        type: String
    },
    totalRows: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Merchant', merchantSchema)