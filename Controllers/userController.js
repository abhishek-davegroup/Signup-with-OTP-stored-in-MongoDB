const bcrypt = require("bcrypt")
const _ = require("lodash") //utility func which facilitates web development
const axios = require('axios')
const otpGenerator = require('otp-generator')

//Importing User and OTP Schema
const {User} = require('../Model/userModel')
const {otp, Otp} = require('../Model/otpModel')

//Function to generate otp of a user
module.exports.signUp = async(req, res) => {
    const user = await User.findOne({
        number: req.body.number
    })
    if(user) return res.status(400).send("User already registered!")
    const OTP = otpGenerator.generate(6, {  //OTP of 6 digits
        digits: true, alphabets: false, upperCase:false, specialChars: false
    })
    const number = req.body.number  //to get the OTP
    console.log(OTP)
/*
    SMS carrier services documentation to be pasted here!
*/
    const otp = new Otp({number: number, otp: OTP})
    const salt = await bcrypt.genSalt(10)   //generate salt of 10 digit hashkey
    otp.otp = await bcrypt.hash(otp.otp, salt)  //Sort OTP
    const result = await otp.save()
    return res.status(200).send("OTP Sent Successfully!")
    
}

module.exports.verifyOtp = async(req, res) => {
    const verifyOtp = await Otp.find({
        number: req.body.number
    })
    if(otpHolder.length === 0) return res.status(400).send("Your OTP is Expired!")
    const rightOtpFind = otpHolder[otpHolder.length - 1]
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)  //Compare OTP with DB OTP

    if(rightOtpFind.number === req.body.number && validUser) {  //for vali users only
        const user = new User(_.pick(req.body, ["number"]))
        const token = user.generateJWT()
        const result = await user.save()
        const OTPDelete = await Otp.deleteMany({    //To delete OTP from DB
            number : rightOtpFind.number
        })
        return res.status(200).send({
            message:"User Registration Successful!",
            token: token,
            data:result
        })
    } else {
        return res.status(400).send("Your OTP is Invalid!")
    }
}