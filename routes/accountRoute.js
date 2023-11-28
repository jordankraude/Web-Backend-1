const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

router.get("/profile", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegistration));

router.get("/logout", utilities.handleErrors(accountController.accountLogout))

router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdate))

// router.get("/profile", res.render("./account/profile", {

// }))

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.post(
  "/updateInfo",
  regValidate.accountInfoRules(),
  regValidate.checkAccountInfoData,
  utilities.handleErrors(accountController.updateAccountInfo)
)

router.post(
  "/updatePassword",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;