
const accountModel = require("../models/account-model")
const classificationModel = require("../models/classification-model")
const inventoryModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


accountController = {}

accountController.buildAccount = async (req, res, next) => {
  let nav = await utilities.getNav()
  let {accountData} = res.locals
  let accountData1 = await accountModel.getAccountById(accountData.account_id)
  account_firstname = accountData1.account_firstname
  account_lastname = accountData1.account_lastname
  account_email = accountData1.account_email
  account_id = accountData1.account_id
  account_type = accountData1.account_type
  res.render("./account/profile", {
    title: "Account Management",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    account_type

  })


}

accountController.buildAccountUpdate = async (req, res, next) => {
  let nav = await utilities.getNav()
  const accountId = req.params.account_id
  account_id = accountId
  const data = await accountModel.getAccountById(accountId)

  res.render("./account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id,

  })
}

accountController.buildLogin = async (req, res, next) => {
    let nav = await utilities.getNav()
    res.render("./account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegistration = async (req, res, next) =>  {
    let nav = await utilities.getNav()
    res.render("./account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async (req, res, next) =>  {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash('notice', 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

  
    if (regResult) {
        req.flash(
          'notice',
          `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("./account/login", {
          title: "Login",
          nav, 
          errors: null
        })
      } 
      else {
        req.flash(
          'notice', 
          "Sorry, the registration failed."
        )
        res.status(501).render("./account/register", {
          title: "Registration",
          nav,
          errors: null, 
        })
      }
    }
  
    accountController.loginAccount = async (req, res, next) =>  {
      let nav = await utilities.getNav()
      const { account_email, account_password } = req.body
      const account = await accountModel.checkExisitingAccount(
        account_email,
        account_password
      )
    
      if (account) {
            req.flash(
              "notice",
              "You're all logged in!"
            )
          let nav = await utilities.getNav()
          res.status(201).render("./account/profile", {
            title: account.account_firstname + " " + account.account_lastname,
            nav,
            errors: null,
          })
        } 
        else {
          req.flash('notice', "Sorry, the login attempt failed please try again.")
          res.status(501).render("./account/login", {
            title: "Login",
            nav,
            errors: null,

          })
        }
      }
  
    accountController.accountLogin = async (req, res, next) => {
      let nav = await utilities.getNav()
      const { account_email, account_password } = req.body
      const accountData = await accountModel.getAccountByEmail(account_email)
      if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        })
      return
      }
      try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        return res.redirect("/account/profile")
        }
      } catch (error) {
        return new Error('Access Forbidden')
      }
      }
    
  accountController.accountLogout = async (req, res) =>{
    res.clearCookie("jwt")
    req.session.destroy()
    res.redirect("/")
  }

  accountController.updateAccountInfo = async (req, res, next) => {
    const {account_id, account_firstname, account_lastname, account_email} = req.body
    const updateResult = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id)
    if (updateResult) {
      let accountData1 = await accountModel.getAccountById(account_id)
      // account_firstname = accountData1.account_firstname
      // account_lastname = accountData1.account_lastname
      // account_email = accountData1.account_email
      // account_id = accountData1.account_id
      account_type = accountData1.account_type
      // let {accountData} = {account_id, account_firstname, account_lastname, account_email}
      // res.clearCookie("jwt")
      // const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      // res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      let nav = await utilities.getNav()
      req.flash("notice", `Thank you ${account_firstname}, your account was successfully updated.`)
      res.status(201).render("./account/profile", {
        title: "Account Management",
        nav, // Pass the flash messages here
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
        account_type
      })
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      account_type

  })
  }
}

  accountController.updatePassword = async (req, res, next) => {
    const {account_id, account_password} = req.body
    const {accountData} = res.locals
    let accountData1 = await accountModel.getAccountById(accountData.account_id)
    account_firstname = accountData1.account_firstname
    account_lastname = accountData1.account_lastname
    account_email = accountData1.account_email
    // account_id = accountData1.account_id
    account_type = accountData1.account_type
    let hashedPassword
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    const updateResult = accountModel.updatePassword(hashedPassword, account_id)
    if (updateResult) {
      let {accountData} = res.locals
      let nav = await utilities.getNav()
      req.flash("notice", `Thank you ${accountData.account_firstname}, your account was successfully updated.`)
      res.status(201).render("./account/profile", {
        title: "Account Management",
        nav, // Pass the flash messages here
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
        account_type
      })
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      account_type
      })
    }
  }
  
  
  
  module.exports = accountController