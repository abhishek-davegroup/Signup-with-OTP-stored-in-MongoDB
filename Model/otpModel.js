//Model to store OTP details

const {Schema, model} = require('mongoose')

module.exports.Otp = model('Otp', Schema({
    number: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required:true
    },
    createdAt: {type:Date, default:Date.now, index:{expires:300}}   //Otp is deleted after 5mins from DB
}, {timestamps: true}))