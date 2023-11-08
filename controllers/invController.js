const invModel = require("../models/inventory-model")
const classificationModel = require("../models/classification-model")
const inventoryModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const accountName = req.session.accountName
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
    accountName
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getCarByInventoryId(vehicle_id)
  const display = await utilities.buildVehicleDisplay(data)
  const accountName = req.session.accountName
  let nav = await utilities.getNav()
  // to be added to title //
  const vehName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/vehicle", {
    title:  vehName,
    nav,
    display,
    accountName
  })
}

 invCont.buildManagerView = async function (req, res, next){
  let nav = await utilities.getManagerNav()
  res.render("./inventory/management", {
    title: "Manager View",
    nav,
    errors: null,
  })
  }


invCont.buildNewClassification = async function (req, res, next) {
    let nav = await utilities.getManagerNav()
    res.render("./inventory/new-classification", {
      title: "New Classification",
      nav,
      errors: null,
    })
  }


invCont.buildNewInventory = async function (req, res, next) {
    let nav = await utilities.getManagerNav()
    dropdown = await utilities.buildDropDown()
    res.render("./inventory/new-inventory", {
      title: "New Inventory",
      nav,
      errors: null,
      dropdown,
    })
  }


/* ****************************************
*  Process Registration
* *************************************** */
invCont.createNewClassification = async function (req, res, next) {
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
          res.status(201).render("./inventory/new-inventory", {
            title: "New Inventory",
            nav, // Pass the flash messages here
            errors: null,
            dropdown
            
          })
          
          nav = await utilities.getManagerNav()
          req.flash("notice", "Sorry, the new classification failed to process.")
          res.status(501).render("./inventory/new-classification", {
            title: "New Classification",
            nav,
            errors: null,
          })
        }
    }
      


/* ****************************************
*  Process Registration
* *************************************** */
invCont.createNewInventory = async function (req, res, next) {
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
          res.status(201).render("./inventory/management", {
            title: "New Inventory",
            nav, // Pass the flash messages here
            errors: null
          })
        } else {
          console.log("Didn't create item")
          dropdown = await utilities.buildDropDown()
          req.flash("notice", "Sorry, the new inventory item failed to be processed.")
          res.status(501).render("./inventory/new-inventory", {
            title: "New Inventory",
            nav,
            errors: null, // Pass the flash messages here
            dropdown
          })
        }
      }



module.exports = invCont