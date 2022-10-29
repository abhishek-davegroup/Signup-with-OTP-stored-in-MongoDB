//For routing the request

const router = require('express').Router()
const { signUp, verifyOtp } = require('../Controllers/userController')

//Creating Routes
router.route('/signup').post(signUp)
router.route('/signup/verify').post(verifyOtp)

module.exports = router
