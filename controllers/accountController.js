const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")

async function buildLogin(req, res, next) {
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
async function buildRegistration(req, res, next) {
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
async function registerAccount(req, res) {
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
  
    async function loginAccount(req, res) {
      let nav = await utilities.getNav()
      const { account_email, account_password } = req.body
      const account = await accountModel.checkExisitingAccount(
        account_email,
        account_password
      )
    
      if (account) {
          req.flash(
            'notice',
            "You're all logged in!"
          )
          if (account.account_type === "Admin"){
            let nav = await utilities.getManagerNav()
            res.status(201).render("management/management", {
              title: "Manager View",
              nav,
              errors: null,
              accountName: account.account_firstname + " " + account.account_lastname,

            })
            res.redirect("/manager?message=You're all logged in!")
          }
          else {
            req.flash(
              "notice",
              "You're all logged in!"
            )
          let nav = await utilities.getNav()
          res.status(201).render("account/profile", {
            title: account.account_firstname + " " + account.account_lastname,
            nav,
            errors: null,
          })
        }
          

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
    
  
  module.exports = { buildLogin, buildRegistration, registerAccount, loginAccount }