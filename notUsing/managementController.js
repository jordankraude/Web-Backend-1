const classificationModel = require("../models/classification-model")
const inventoryModel = require("../models/inventory-model")
const utilities = require("../utilities/")
let dropdown

async function buildManagerView(req, res, next){
  let nav = await utilities.getManagerNav()
  res.render("management/management", {
    title: "Manager View",
    nav,
    errors: null,
  })
  }


async function buildNewClassification(req, res, next) {
    let nav = await utilities.getManagerNav()
    res.render("./management/new-classification", {
      title: "New Classification",
      nav,
      errors: null,
    })
  }


async function buildNewInventory(req, res, next) {
    let nav = await utilities.getManagerNav()
    dropdown = await utilities.buildDropDown()
    res.render("./management/new-inventory", {
      title: "New Inventory",
      nav,
      errors: null,
      dropdown,
    })
  }


/* ****************************************
*  Process Registration
* *************************************** */
async function createNewClassification(req, res) {
    let nav = await utilities.getManagerNav()
    const { classification_name } = req.body
      
      const classificationResult = await classificationModel.createNewClassification(
        classification_name
      )
  
    
      if (classificationResult) {

          req.flash(
            "notice",
            `You created a new classification now please add cars with that classification to your inventory.`
          )
          nav = await utilities.getManagerNav()
          dropdown = await utilities.buildDropDown()
          res.status(201).render("./management/new-inventory", {
            title: "New Inventory",
            nav, // Pass the flash messages here
            errors: null,
            dropdown
            
          })
          
          nav = await utilities.getManagerNav()
          req.flash("notice", "Sorry, the new classification failed to process.")
          res.status(501).render("./management/new-classification", {
            title: "New Classification",
            nav,
            errors: null,
          })
        }
    }
      


/* ****************************************
*  Process Registration
* *************************************** */
async function createNewInventory(req, res) {
    console.log("starting to make new inventory")
    let nav = await utilities.getManagerNav()
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  
    const inventoryResult = await inventoryModel.createNewInventory(
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color,
        classification_id
      )
  
    
      if (inventoryResult) {
          req.flash(
            "notice",
            `Congratulations, you created a new inventory item.`
          )
          console.log("Created Item")
          nav = await utilities.getManagerNav()
          res.status(201).render("./management/management", {
            title: "New Inventory",
            nav, // Pass the flash messages here
            errors: null
          })
        } else {
          console.log("Didn't create item")
          dropdown = await utilities.buildDropDown()
          req.flash("notice", "Sorry, the new inventory item failed to be processed.")
          res.status(501).render("./management/new-inventory", {
            title: "New Inventory",
            nav,
            errors: null, // Pass the flash messages here
            dropdown
          })
        }
      }

module.exports = {buildManagerView, buildNewClassification, buildNewInventory, createNewClassification, createNewInventory}