const mongoose = require('mongoose');

const table = new mongoose.Schema({
    Email:{
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    Nickname:{
        type: String,
        required: true
    }
})

const mymodel = mongoose.model("Accounts",table);
module.exports = mymodel;